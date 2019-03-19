import * as program from 'commander'

export type ConfigurerData = {
  baseFolder: string
  docsFolder: string
  docsSection: string
}

export class Configurer {
  constructor() {
    this.setupOptions()
  }

  private setupOptions(): void {
    const version = '0.0.1'

    program
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-b, --baseFolder [baseFolder]', 'Select base folder where README.md is located')
      .option('-d, --docsFolder [docsFolder]', 'Select base folder where README.md is located')
      .option('-s, --docsSection [docsSection]', 'Select section where to list documentation in README.md')
      .parse(process.argv)

    if (!program.docsSection) {
      console.error('-s, --docsSection required')
      process.exit(1)
      return
    }
  }

  fetchData(): ConfigurerData {
    const baseFolder = program.baseFolder || './'
    const docsFolder = program.docsFolder || './'
    const docsSection = program.docsSection

    return {
      baseFolder: baseFolder,
      docsFolder: docsFolder,
      docsSection: docsSection
    }
  }
}
