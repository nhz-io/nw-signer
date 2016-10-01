import {Stream} from 'stream'
import test from 'ava'
import through from 'through2'
import Vinyl from 'vinyl'
import payload from '../../lib/payload'

const testPayload = ({t, files, data}) =>
    new Promise(resolve => {
        const stream = payload()
        stream.pipe(through.obj((file, enc, cb) => {
            const payload = JSON.parse(file.contents.toString())
            t.deepEqual(payload, data)
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

test('payload', t => testPayload({t,
    data: require('../fixtures/payload/payload.json'),
    files: [
        new Vinyl(),
        mkfile('empty', '/test', ''),
        mkfile('4095', '/test', mkstream(Array(4095 + 1).join('.'))),
        mkfile('4096', '/test', mkbuff(Array(4096 + 1).join('.'))),
        mkfile('4097', '/test', mkbuff(Array(4097 + 1).join('.'))),
        mkfile('16Meg', '/test', mkbuff(Array((4096 * 4096) + 1).join('.'))),
    ],
}))
