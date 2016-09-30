import test from 'ava'
import {
    ITEM_ID,
    ITEM_VERSION,
    MANIFEST,
    PROTECTED,
    PROTECTED_B64,
} from '../../lib/constants'

test('ITEM_ID', t => t.is(ITEM_ID, 'abcdefghijklmnopabcdefghijklmnop'))

test('ITEM_VERSION', t => t.is(ITEM_VERSION, '1.2.3'))

test('MANIFEST', t => t.is(MANIFEST, 'package.json'))

test('PROTECTED', t => t.is(PROTECTED, '{"alg":"RS256"}'))

test('PROTECTED_B64', t => t.is(PROTECTED_B64, 'eyJhbGciOiJSUzI1NiJ9'))
