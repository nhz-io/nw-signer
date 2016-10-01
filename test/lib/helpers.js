import {writeFileSync, unlinkSync} from 'fs'
import test from 'ava'
import tempfile from 'tempfile'
import NodeRSA from 'node-rsa'
import {
    rsaKey,
    sanitize,
    encode,
    sign,
} from '../../lib/helpers'
import {KEY, KEY_SIGNATURE} from '../../lib/constants'

test('sanitize', t => {
    const buff = Buffer.alloc(0)
    t.is(sanitize(buff), buff)
    t.is(sanitize(), null)
    t.is(sanitize({}), null)
    t.is(sanitize(123), null)
})

test('sanitize json string', t => {
    const json = '{"test": true}'
    const buff = sanitize(json)
    t.true(buff instanceof Buffer)
    t.is(buff.toString(), json)
})

test('sanitize json path', t => {
    const json = '{"test": true}'
    const test = tempfile()
    writeFileSync(test, json)
    const buff = sanitize(test)
    t.true(buff instanceof Buffer)
    t.is(buff.toString(), json)
    unlinkSync(test)
})

test('encode string', t =>
    t.is(encode('???~~~'), 'Pz8_fn5-')
)

test('encode buffer', t => {
    t.is(encode(Buffer.from('???~~~')), 'Pz8_fn5-')
})

test('sign', t => {
    const key = new NodeRSA(KEY)
    t.is(sign(key, KEY), KEY_SIGNATURE)
})

test('rsaKey', t => {
    const key = new NodeRSA(KEY)
    t.true(rsaKey() instanceof NodeRSA)
    t.is(rsaKey(key), key)
    t.true(rsaKey(KEY) instanceof NodeRSA)
})
