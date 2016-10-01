import test from 'ava'
import through from 'through2'
import Vinyl from 'vinyl'
import signer from '../../lib/signer'

test('signer', t =>
    new Promise(resolve => {
        const files = [
            new Vinyl({
                cwd: '/',
                base: '/test',
                path: '/test/package.json',
                contents: Buffer.from('{}'),
            }),
            new Vinyl({
                cwd: '/',
                base: '/test',
                path: '/test/a',
                contents: Buffer.from('a'),
            }),
            new Vinyl({
                cwd: '/',
                base: '/test',
                path: '/test/b',
                contents: (function () {
                    const stream = through()
                    stream.write('b')
                    stream.end()
                    return stream
                })(),
            }),
        ]

        const stream = signer()
        stream.pipe(through.obj((file, enc, cb) => {
            const verified = JSON.parse(file.contents.toString())
            t.deepEqual(verified, [{
                /* eslint-disable camelcase */
                description: 'treehash per file',
                signed_content: {
                    payload:
                        'eyJjb250ZW50X2hhc2hlcyI6eyJibG9ja19zaXplIjo0MDk2LCJm' +
                        'b3JtYXQiOiJ0cmVlaGFzaCIsImhhc2hfYmxvY2tfc2l6ZSI6NDA5' +
                        'NiwiZmlsZXMiOlt7InBhdGgiOiJwYWNrYWdlLmpzb24iLCJyb290' +
                        'X2hhc2giOiJSQk52bzFXelo0b1JScTBXOS1oa25wVDdUOElmNTM2' +
                        'REVNQmc5aHlxXzRvIn0seyJwYXRoIjoiYSIsInJvb3RfaGFzaCI6' +
                        'InlwZUJFc29idmNyNndqR3ptaVBjVGFlRzdfZ1VmRTV5dVlCM2hh' +
                        'X3VTTHMifSx7InBhdGgiOiJiIiwicm9vdF9oYXNoIjoiUGlQb0Zn' +
                        'QTVXVW96aVU5bFpPR3hOSXU5ZWdDSTFDeEt5M1B1cnRXY0FKMCJ9' +
                        'XX0sIml0ZW1faWQiOiJhYmNkZWZnaGlqa2xtbm9wYWJjZGVmZ2hp' +
                        'amtsbW5vcCIsIml0ZW1fdmVyc2lvbiI6IjEuMi4zIn0',
                    manifest: 'e30',
                    signatures: [
                        {
                            header: {
                                kid: 'publisher',
                            },
                            protected: 'eyJhbGciOiJSUzI1NiJ9',
                            signature: 'whatever',
                        },
                        {
                            header: {
                                kid: 'manifest',
                            },
                            protected: 'eyJhbGciOiJSUzI1NiJ9',
                            signature:
                                'HqH4XLpIJ2ECVhxGia0V9e0YJXuUz5jYtRj9queM-6P3' +
                                '4_jX54Yz-vYwqvsJJpJF3PjA7eDyBZm3moHZhppaGMAt' +
                                'iuEeU7yA7jPyWPofdtGo1JqkD-auWjpz6sBwVNTPT-G8' +
                                'mcR0t2hfK6710ixLLE6DZ_DGmT0Pzb-K8oYK2NLb2mRL' +
                                '0eAyv0lVef6LFqkW57nHYX8Uj6VVulcaa0WpoOoQRKjy' +
                                'Z4DV3oew-OahgRz83Tm2PD6k83eT_7zv_Dd7jGm8hXp6' +
                                'IdxF64QKYQBUooszova_ockp1NgayBVaVk7VGmkMZn35' +
                                'kgdBQ2qiK_FPTpReW3EBAAHXf1m1wagV9A',
                        },
                        {
                            header: {
                                kid: 'nwjs',
                            },
                            protected: 'eyJhbGciOiJSUzI1NiJ9',
                            signature:
                                'x46O8Ssr8T7S_XwSlI15ITnUIlVDRTKXYqdq4PK6kEpl' +
                                '6-yHQgXe5_o2arkVnh0P5IjM8cZrFHEgVZ2-QSAtdIG3' +
                                'ex4AbHQwWrzlTv4zqA-8EoND95lgbqBvQouR_0tiBFWi' +
                                'xo-93rznbpdTqfBHAcsPWqvmvXRTJouVMM-LvkQWYY9O' +
                                'Qpxlw9md9dtOdNy_eKuRh5V333JYAr_ffQ85tJgGbptt' +
                                'h1t3FjW61RUoRY6CLuiBZe11KHDXAVaG3l_z8Bssh1PN' +
                                'b20n_r_NPZR1WT15tEKEcQVU5C6t6M7K06D17wmefDgn' +
                                'G_0iY1KcrWoL_wip7AVyBPfiAk2pqYysNQ',
                        },
                    ],
                },
                /* eslint-enable camelcase */
            }])

            resolve()
            cb()
        }))

        files.forEach(file => stream.write(file))
        stream.end()
    })
)
