import * as program from 'commander';

export type ConfigurerData = {
  baseFolder: string;
  docsFolder: string
};

export class Configurer {
  constructor() {
    this.setupOptions();
  }

  private setupOptions(): void {
    const version = '0.0.1';

    program
      .version(version, '-v, --version')
      .allowUnknownOption()
      .option('-b, --baseFolder [baseFolder]', 'Select base folder where README.md is located')
      .option('-d, --docsFolder [docsFolder]', 'Select base folder where README.md is located')
      .parse(process.argv);
  }

  fetchData(): ConfigurerData {
    const baseFolder = program.baseFolder || './';
    const docsFolder = program.docsFolder || './';

    return {
      baseFolder: baseFolder,
      docsFolder: docsFolder
    };
  }
}
