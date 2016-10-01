'use strict'

const {readFileSync} = require('fs')
const NodeRSA = require('node-rsa')
const {fixBase64} = require('@nhz.io/nw-treehash/lib/helpers')

const {KEY, PROTECTED_B64} = require('./constants')

function rsaKey(...args) {
    const [key] = args
    if (!key) {
        return new NodeRSA(KEY)
    }

    if (
        typeof key.sign === 'function' &&
        typeof key.verify === 'function' &&
        typeof key.encrypt === 'function' &&
        typeof key.decrypt === 'function'
    ) {
        return key
    }

    return new NodeRSA(...args)
}

function sanitize(json) {
    if (typeof json === 'string') {
        try {
            if (typeof JSON.parse(json) !== 'object') {
                throw new Error()
            }

            return Buffer.from(json)
        } catch (err) {}

        try {
            const loaded = readFileSync(json)
            if (typeof JSON.parse(loaded) !== 'object') {
                throw new Error()
            }

            return Buffer.from(loaded)
        } catch (err) {
            return null
        }
    }

    if (json instanceof Buffer) {
        return json
    }

    return null
}

function encode(data) {
    if (typeof data === 'string') {
        data = Buffer.from(data)
    }

    if (!(data instanceof Buffer)) {
        try {
            data = Buffer.from(JSON.stringify(data))
        } catch (err) {
            return
        }
    }

    if (data instanceof Buffer) {
        return fixBase64(data.toString('base64'))
    }
}

function sign(key, data) {
    return fixBase64(
        key.sign(`${PROTECTED_B64}.${data.toString()}`).toString('base64')
    )
}

module.exports = {
    rsaKey,
    sanitize,
    encode,
    sign,
}
