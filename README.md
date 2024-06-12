[![Coverage Status](https://coveralls.io/repos/github/silversonicaxel/summary-more/badge.svg?branch=master)](https://coveralls.io/github/silversonicaxel/summary-more?branch=master)

# summary-more
summary-more is a tool that search for all *.md files in your project and list them in the README.md file.
What summary-more specifically does is to search in the folder (current or provided one) all the *.md files and list their links one by one inside a provided _section_ of the README.md file.
This is a fast and automatic way to quickly link all the documents inside of a project in the main README.md and it is pretty useful for massive or big documented projects.

The outcome of this application is visible in the example [README.md](fixtures/README.md).

## Requirements
* node 10.12+
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

-v, --version                           output the version number
-s, --docsSection [docsSection]         * section title where documentation will be listed in README.md
-b, --baseFolder [baseFolder]           base folder where README.md is located
-d, --docsFolder [docsFolder]           subfolder of the basefolder where documentation is located
-l, --headingLevel [headingLevel]       heading level of the section title within README.md
-h, --help                              output usage information


* Mandatory
```

## Usage

```bash
$ summary-more -s 'documentation'
```

```bash
$ summary-more -d 'docs' -s 'Summary'
```

```bash
$ summary-more -b 'manual' -d 'docs' -s 'Summary'
```

```bash
$ summary-more -b 'manual' -d 'docs' -s 'Summary' -l 2
```
