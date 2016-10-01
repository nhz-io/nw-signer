<h1 align="center">@nhz.io/nw-signer</h1>

<p align="center">
  <a href="https://npmjs.org/package/@nhz.io/nw-signer">
    <img src="https://img.shields.io/npm/v/@nhz.io/nw-signer.svg?style=flat"
         alt="NPM Version">
  </a>

  <a href="https://www.bithound.io/github/nhz-io/nw-signer">
    <img src="https://www.bithound.io/github/nhz-io/nw-signer/badges/score.svg"
         alt="Bithound Status">
  </a>

  <a href="https://github.com/nhz-io/nw-signer/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nhz-io/nw-signer.svg?style=flat"
         alt="License">
  </a>
</p>

<h3 align="center">[NWJS](https://nwjs.io) content signer vinyl stream<h2>

## Install
```bash
npm i -D @nhz.io/nw-signer
```

## Usage
```js
const through = require('through2')
const vfs = require('vinyl-fs')
const signer = require('@nhz.io/nw-signer')

vfs.src(process.argv.slice(2))
    .pipe(signer())
    .pipe(through.obj((file, enc, cb) => {
        process.stdout.write(file.contents)
        cb()
    }))
```

## Dev

```bash
git clone https://github.com/nhz-io/nw-signer
cd nw-signer
npm i
npm start
```

### Docs
```bash
npm run doc
```

### Coverage
```bash
npm run coverage
```

### See also
* [https://github.com/nhz-io/nw-treehash](https://github.com/nhz-io/nw-treehash)
* [https://github.com/nwjs/nw.js/blob/nw18/tools/sign/sign.py](https://github.com/nwjs/nw.js/blob/nw18/tools/sign/sign.py)
* [https://github.com/nwjs/nw.js/blob/nw18/tools/payload.cc](https://github.com/nwjs/nw.js/blob/nw18/tools/payload.cc)

## License

### [MIT](LICENSE)
