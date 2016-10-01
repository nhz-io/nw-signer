'use strict'

const Vinyl = require('vinyl')
const through = require('through2')
const duplex = require('duplexer2')
const treehash = require('@nhz.io/nw-treehash')
const {BLOCK_SIZE} = require('@nhz.io/nw-treehash/lib/constants')
const {fixBase64} = require('@nhz.io/nw-treehash/lib/helpers')

const FORMAT = 'treehash'

function hashFile(file, enc, cb) {
    if (Vinyl.isVinyl(file)) {
        const stream = through()

        stream.pipe(treehash()).pipe(through((hash, enc, _cb) => {
            file.treehash = hash
            _cb()
            cb(null, file)
        }))

        if (file.isBuffer(file)) {
            stream.write(file.contents)
            return stream.end()
        }

        if (file.isStream(file)) {
            return file.contents.pipe(stream)
        }
    }

    cb()
}

function createEntry(file, enc, cb) {
    if (file && file.treehash) {
        file.treehash = {
            path: file.relative.replace(/\\/g, '/'),

            // eslint-disable-next-line camelcase
            root_hash: fixBase64(file.treehash.toString('base64')),
        }

        this.emit('data', file)
    }

    cb()
}

function createPayload(file, enc, cb) {
    if (!this.payload) {
        this.payload = {
            block_size: BLOCK_SIZE, // eslint-disable-line camelcase
            format: FORMAT,
            hash_block_size: BLOCK_SIZE, // eslint-disable-line camelcase
            files: [],
        }
    }

    // eslint-disable-next-line camelcase
    if (file.treehash && file.treehash.path && file.treehash.root_hash) {
        this.payload.files.push(file.treehash)
    }

    cb()
}

function flush(cb) {
    this.push(new Vinyl({
        contents: Buffer.from(JSON.stringify(this.payload)),
    }))
    cb()
}

module.exports = function payload() {
    const writable = through.obj(hashFile)
    const readable = through.obj(createPayload, flush)
    writable.pipe(through.obj(createEntry)).pipe(readable)
    return duplex({objectMode: true}, writable, readable)
}
