const ITEM_ID = 'abcdefghijklmnopabcdefghijklmnop'

const ITEM_VERSION = '1.2.3'

const PROTECTED = '{"alg":"RS256"}'

const PROTECTED_B64 = Buffer.from(PROTECTED).toString('base64')

const MANIFEST = 'package.json'

module.exports = {
    ITEM_ID, ITEM_VERSION,
    PROTECTED, PROTECTED_B64,
    MANIFEST,
}
