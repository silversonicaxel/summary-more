import { Command } from 'commander'

export type ConfigurerData = {
  baseFolder: string
  docsFolder: string
  docsSection: string,
  headingLevel: string
}

export class Configurer {
  program: Command

  constructor() {
    this.program = new Command()
    this.setupOptions()
  }

  private setupOptions(): void {
    const version = '3.3.0'

    this.program
      .storeOptionsAsProperties(true)
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-b, --baseFolder [baseFolder]', 'Select base folder where README.md is located')
      .option('-d, --docsFolder [docsFolder]', 'Select subfolder of the base folder where documentation is located')
      .option('-s, --docsSection [docsSection]', 'Select section where to list documentation in README.md')
      .option(
        '-l, --headingLevel [headingLevel]',
        'Select heading level of the section title within README.md',
        parseInt
      )
      .parse(process.argv)

    const opts = this.program.opts()

    if (!opts.docsSection) {
      console.error('-s, --docsSection required')
      process.exit(1)
      return
    }

    if (opts.headingLevel && (opts.headingLevel < 1 || opts.headingLevel > 6)) {
      console.error('-l, --headingLevel is not set correctly, it must be an integer between 1 and 6')
      process.exit(1)
      return
    }
  }

  fetchData(): ConfigurerData {
    const opts = this.program.opts()

    const baseFolder = opts.baseFolder || './'
    const docsFolder = opts.docsFolder || './'
    const docsSection = opts.docsSection
    const headingLevel = opts.headingLevel

    return {
      baseFolder: baseFolder,
      docsFolder: docsFolder,
      docsSection: docsSection,
      headingLevel: headingLevel
    }
  }
}
