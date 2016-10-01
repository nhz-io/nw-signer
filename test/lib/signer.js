import {Stream} from 'stream'
import test from 'ava'
import through from 'through2'
import Vinyl from 'vinyl'
import vfs from 'vinyl-fs'
import signer from '../../lib/signer'

const testSigner = ({t, files, key, manifest, data}) =>
    new Promise(resolve => {
        const stream = signer(key, manifest)
        stream.pipe(through.obj((file, enc, cb) => {
            const verified = JSON.parse(file.contents.toString())
            t.deepEqual(verified, data)
            resolve()
            cb()
        }))

        if (files instanceof Stream) {
            return files.pipe(stream)
        }

        if (Array.isArray(files)) {
            files.forEach(file => stream.write(file))
            stream.end()
        }
    })

const mkfile = (name, base, contents) => new Vinyl({
    base,
    cwd: '/',
    path: `${base}/${name}`,
    contents: (typeof contents === 'string' ? Buffer.from(contents) : contents),
})

const mkstream = data => {
    const stream = through()
    stream.write(data)
    stream.end()
    return stream
}

const mkbuff = data => Buffer.from(data)

test('sign vinyl files with default key', t => testSigner({t,
    data: require('../fixtures/signer/verified_contents.json'),
    files: [
        mkfile('a', '/test', mkbuff('a')),
        mkfile('b', '/test', 'b'),
        mkfile('package.json', '/test', mkstream('{}')),
    ],
}))

test('sign vinyl stream with default key', t => testSigner({t,
    data: require('../fixtures/signer/verified_contents.json'),
    files:
        vfs.src([
            '../fixtures/signer/a',
            '../fixtures/signer/b',
            '../fixtures/signer/package.json',
        ])
        .pipe(through.obj((file, enc, cb) => {
            file.path = `/test/${file.basename}`
            file.cwd = '/'
            file.base = '/test'
            cb(null, file)
        })),
}))
