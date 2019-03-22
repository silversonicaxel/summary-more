[![Build Status](https://travis-ci.org/silversonicaxel/readme-more.svg?branch=master)](https://travis-ci.org/silversonicaxel/readme-more)

# summary-more
summary-more is a tool that serch for all *.md files in your project and list them in the README.md file.
What summary-more specifically does is to search in the folder (current or provided one) all the *.md files and list their links one by one inside a provided _section_ of the README.md file.
This is a fast and automatic way to quickly link all the documents inside of a project in the main README.md and it is pretty useful for massive or big documented projects.

The outcome of this application is visible in the example [README.md](fixtures/README.md).


## Requirements
* node 10.0+
* npm 6.0+

## Installation
summary-more can be installed as a global tool:

```bash
$ npm install -g summary-more

$ yarn global add summary-more
```

or as a devDependency:

```bash
$ npm install -D summary-more

$ yarn add --dev summary-more
```

## Help
```bash

$ summary-more --help

Usage: summary-more [options] <option>

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
$ summary-more -s "documentation"

$ summary-more -d "docs" -s "Summary"
```

