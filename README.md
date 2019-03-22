[![Build Status](https://travis-ci.org/silversonicaxel/readme-more.svg?branch=master)](https://travis-ci.org/silversonicaxel/readme-more)

# readme-more
readme-more is a tool that serch for all *.MD files in your project and summarize them in the README.md


## Requirements
* node 10.0+
* npm 6.0+

## Installation
readme-more can be installed as a global tool:

```bash
$ npm install -g readme-more

$ yarn global add readme-more
```

or as a devDependency:

```bash
$ npm install -D readme-more

$ yarn add --dev readme-more
```

## Help
```bash

$ readme-more --help

Usage: readme-more [options] <option>

  Options:

    -v, --version                           Output the version number
    -b, --baseFolder [baseFolder]           Select base folder where README.md is located
    -d, --docsFolder [docsFolder]           Select subfolder of the base folder where documentation is located
    -s, --docsSection [docsSection]         Select section where to list documentation in README.md
    -h, --help                              Output usage information

```

## Usage

```bash
$ read-more -s "documentation"

$ read-more -d "docs" -s "Summary"
```

