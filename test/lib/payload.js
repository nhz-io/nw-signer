import test from 'ava'
import through from 'through2'
import Vinyl from 'vinyl'
import payload from '../../lib/payload'

test('payload', t =>
    new Promise(resolve => {
        const files = [
            new Vinyl(),
            new Vinyl({
                cwd: '/',
                base: '/test',
                path: '/test/empty',
                contents: Buffer.alloc(0),
            }),
            new Vinyl({
                cwd: '/',
                base: '/test',
                path: '/test/4095',
                contents: Buffer.from(Array(4095 + 1).join('.')),
            }),
            new Vinyl({
                cwd: '/',
                base: '/test',
                path: '/test/4096',
                contents: (function () {
                    const stream = through()
                    stream.write(Buffer.from(Array(4096 + 1).join('.')))
                    stream.end()
                    return stream
                })(),
            }),
            new Vinyl({
                cwd: '/',
                base: '/test',
                path: '/test/4097',
                contents: Buffer.from(Array(4097 + 1).join('.')),
            }),
            new Vinyl({
                cwd: '/',
                base: '/test',
                path: '/test/16Meg',
                contents: Buffer.from(Array((4096 * 4096) + 1).join('.')),
            }),
        ]

        const stream = payload()
        stream.pipe(through.obj((file, enc, cb) => {
            const payload = JSON.parse(file.contents.toString())
            t.deepEqual(payload, {
                /* eslint-disable camelcase */
                block_size: 4096,
                hash_block_size: 4096,
                format: 'treehash',
                files: [
                    {
                        path: 'empty',
                        root_hash: '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU',
                    },
                    {
                        path: '4095',
                        root_hash: 'Cx_NFiSfI5TOktQmfZkfYupivhHCYhr3MCe6DnhI8wQ',
                    },
                    {
                        path: '4096',
                        root_hash: 'JkU0J8E8hd8tlJW6GtwWsNJeS18zgRjPw2i8hP8aKdE',
                    },
                    {
                        path: '4097',
                        root_hash: 'fAU92pVOxXY1-BPEU_OLwaYuowJK7e29Lzxb2K3PRQ4',
                    },
                    {
                        path: '16Meg',
                        root_hash: 'myk0NL3tA-eoQrpI0aPa6ExaCjI0DPui6vdMad-0f4Y',
                    },
                ],
                /* eslint-enable camelcase */
            })
            resolve()
            cb()
        }))

        files.forEach(file => stream.write(file))
        stream.end()
    })
)
