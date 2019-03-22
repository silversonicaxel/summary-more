[![Build Status](https://travis-ci.org/silversonicaxel/readme-more.svg?branch=master)](https://travis-ci.org/silversonicaxel/readme-more)

# readme-more
readme-more is a tool that serch for all *.md files in your project and summarize them in the README.md.
What readme-more specifically does is to search in the folder (default or custom) all the *.md files and list their links inside a provided _section_ of the README.md file.
This is a fast and automatic way to quickly link all the documents inside of a project in the main README.md.

The outcome of this application is visible in the example [README.md](fixtures/README.md).


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
    -s, --docsSection [docsSection]         * Select section where to list documentation in README.md
    -b, --baseFolder [baseFolder]           Select base folder where README.md is located
    -d, --docsFolder [docsFolder]           Select subfolder of the base folder where documentation is located
    -h, --help                              Output usage information


* Mandatory
```

## Usage

```bash
$ read-more -s "documentation"

$ read-more -d "docs" -s "Summary"
```

