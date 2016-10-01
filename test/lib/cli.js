import {exec} from 'child_process'
import path from 'path'
import test from 'ava'

const testCli = ({t, root, glob, result}) =>
    new Promise((resolve, reject) => {
        const cli = path.resolve(__dirname, '../../lib/cli.js')
        const proc = exec(`node ${cli} ${root} ${glob}`)
        const buff = []

        proc.stdout.on('data', buff.push.bind(buff))

        proc.stderr.on('data', reject)

        proc.on('error', reject)

        proc.on('close', err => {
            if (err) {
                return reject(err)
            }
            t.deepEqual(JSON.parse(buff.join('')), result)
            resolve()
        })
    })

test('calculate verified contents for signer fixtures', t => testCli({t,
    root: path.resolve(__dirname, '../fixtures/signer'),
    glob: '\'*\'',
    result: require('../fixtures/signer/verified_contents.json'),
}))
