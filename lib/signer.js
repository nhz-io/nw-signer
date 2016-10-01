'use strict'

const Vinyl = require('vinyl')
const through = require('through2')
const duplex = require('duplexer2')
const {rsaKey, sanitize, encode, sign} = require('./helpers')
const {mkblock, concat} = require('@nhz.io/nw-treehash/lib/helpers')
const payload = require('./payload')
const {MANIFEST, PROTECTED_B64, ITEM_ID, ITEM_VERSION} = require('./constants')

function loadManifest(ctx) {
    return function (file, enc, cb) {
        if (Vinyl.isVinyl(file) && file.relative === MANIFEST) {
            if (file.isBuffer(file)) {
                ctx.manifest = file.contents
                return cb(null, file)
            }

            if (file.isStream(file)) {
                ctx.manifest = mkblock()
                file.contents = file.contents.pipe(through.obj(
                    function (chunk, enc, cb) {
                        ctx.manifest = concat(ctx.manifest, chunk)
                        cb(null, chunk)
                    }
                ))
            }
        }
        cb(null, file)
    }
}

function signContent(ctx) {
    /* eslint-disable camelcase */
    return function (payload, enc, cb) {
        ctx.payload = {
            content_hashes: [JSON.parse(payload.contents.toString())],
            item_id: ITEM_ID,
            item_version: ITEM_VERSION,
        }

        ctx.encoded = {
            payload: encode(ctx.payload),
            manifest: encode(ctx.manifest),
        }

        ctx.signatures = {
            payload: sign(ctx.key, ctx.encoded.payload),
            manifest: sign(ctx.key, ctx.encoded.manifest),
        }

        ctx.verified = [
            {
                description: 'treehash per file',
                signed_content: {
                    payload: ctx.encoded.payload,
                    manifest: ctx.encoded.manifest,
                    signatures: [
                        {
                            header: {kid: 'publisher'},
                            protected: PROTECTED_B64,
                            signature: 'whatever',
                        },
                        {
                            header: {kid: 'manifest'},
                            protected: PROTECTED_B64,
                            signature: ctx.signatures.manifest,
                        },
                        {
                            header: {kid: 'nwjs'},
                            protected: PROTECTED_B64,
                            signature: ctx.signatures.payload,
                        },
                    ],
                },
            },
        ]

        cb(null, new Vinyl({
            contents: Buffer.from(JSON.stringify(ctx.verified)),
        }))
    }
    /* eslint-enable camelcase */
}

module.exports = function signer(key, manifest) {
    const ctx = {
        key: rsaKey(key),
        manifest: sanitize(manifest),
    }

    const writable =
        ctx.manifest ? through.obj() : through.obj(loadManifest(ctx))

    const readable = through.obj(signContent(ctx))

    writable.pipe(payload()).pipe(readable)

    return duplex({objectMode: true}, writable, readable)
}
