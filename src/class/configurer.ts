import * as program from 'commander'

export type ConfigurerData = {
  baseFolder: string
  docsFolder: string
  docsSection: string,
  headingLevel: number | undefined
}

export class Configurer {
  constructor() {
    this.setupOptions()
  }

  private setupOptions(): void {
    const version = '2.0.1'

    program
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-b, --baseFolder [baseFolder]', 'Select base folder where README.md is located')
      .option('-d, --docsFolder [docsFolder]', 'Select subfolder of the base folder where documentation is located')
      .option('-s, --docsSection [docsSection]', 'Select section where to list documentation in README.md')
      .option('-l, --headingLevel [headingLevel]', 'Select heading level of the section title within README.md', parseInt)
      .parse(process.argv)

    if (!program.docsSection) {
      console.error('-s, --docsSection required')
      process.exit(1)
      return
    }

    if (program.headingLevel && (program.headingLevel < 1 || program.headingLevel > 6)) {
      console.error('-l, --headingLevel is not set correctly, it must be an integer between 1 and 6')
      process.exit(1)
      return
    }
  }

  fetchData(): ConfigurerData {
    const baseFolder = program.baseFolder || './'
    const docsFolder = program.docsFolder || './'
    const docsSection = program.docsSection
    const headingLevel = program.headingLevel

    return {
      baseFolder: baseFolder,
      docsFolder: docsFolder,
      docsSection: docsSection,
      headingLevel: headingLevel
    }
  }
}
