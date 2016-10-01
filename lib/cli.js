#!/usr/bin/env node

const vfs = require('vinyl-fs')
const through = require('through2')
const signer = require('./signer')

const [root, ...globs] = process.argv.slice(2)

process.chdir(root)

vfs.src([...globs, '!verified_contents.json', '!payload.json'])
    .pipe(signer())
    .pipe(through.obj((file, enc, cb) => {
        process.stdout.write(file.contents)
        cb()
    }))
