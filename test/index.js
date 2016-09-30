import test from 'ava'
import index from '../index'
import signer from '../lib/signer'

test('index', t => {
    t.is(typeof index, 'function')
    t.is(index, signer)
})
