# textr-cli

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]

> Command line interface for [Textr][textr]

It can compose any functions that transforms text using [Textr][textr]. For example, check out few: [typographic-quotes][typographic-quotes],
[typographic-math-symbols][typographic-math-symbols],
[typographic-em-dashes][typographic-em-dashes] and [typographic-ellipses][typographic-ellipses].

## Install

Install `textr` globaly:

    npm install -g textr-cli

## Usage

After install, you can use `textr` command for processing your text files, like this:

```sh
# load from file, transformers required through few -t flags
$ textr foo.md -t typographic-quotes -t typographic-quotes

# load from file, transformers required through one -t
$ textr foo.md -t typographic-single-spaces,typographic-quotes

# load through stdin, iso-locale equals ru, transformers using --transforms
$ cat foo.md | textr -l ru --transforms=typographic-single-spaces

# load through stdin, write result into file
$ cat foo.md | textr -o bar.md
```

## Options

You can use `textr` with specified options:

*  `-t`, `--transforms` — array of transformers, which will be applied (transformers should be installed globaly or localy in current project);
* `-o`, `--out-file` — write output to file;
* `-l`, `--locale` — ISO 639 locale codes (`en-us` as default);
* `-h`, `--help` — show help message.

## Real world

For example, you have a markdown article with some typographic mistakes, like a three pe­ri­ods instead of el­lip­sis character or whatever else. Thanks for **textr-cli** you can easily fix this. Just run `textr` with transformers which you need and get corrected text:

```sh
$ cat foo.md
Hello,   "world"...
Yet    "another" string
Yet...    one…

$ textr foo.md -t typographic-single-spaces,typographic-quotes,typographic-ellipses
Hello, “world”…
Yet “another” string
Yet… one…
```

Typography for everybody!

## License

MIT © [Denys Dovhan](http://denysdovhan.com)

[textr]: https://github.com/shuvalov-anton/textr/

[typographic-quotes]: https://github.com/matmuchrapna/typographic-quotes
[typographic-math-symbols]: https://github.com/matmuchrapna/typographic-math-symbols
[typographic-em-dashes]: https://github.com/matmuchrapna/typographic-em-dashes
[typographic-ellipses]: https://github.com/matmuchrapna/typographic-ellips

[npm-url]: https://npmjs.org/package/textr-cli
[npm-image]: https://img.shields.io/npm/v/textr-cli.svg?style=flat

[travis-url]: https://travis-ci.org/denysdovhan/textr-cli
[travis-image]: https://img.shields.io/travis/denysdovhan/textr-cli.svg?style=flat

[depstat-url]: https://david-dm.org/denysdovhan/textr-cli
[depstat-image]: https://david-dm.org/denysdovhan/textr-cli.svg?style=flat
