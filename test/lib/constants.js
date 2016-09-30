import test from 'ava'
import {ITEM_ID, ITEM_VERSION} from '../../lib/constants'

test('ITEM_ID', t => t.is(ITEM_ID, 'abcdefghijklmnopabcdefghijklmnop'))

test('ITEM_VERSION', t => t.is(ITEM_VERSION, '1.2.3'))
