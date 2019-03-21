import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

export class Maker {
  private readDirAsync: Function
  private statAsync: Function
  private readFileAsync: Function
  private foldersToExlcude: string[] = ['node_modules', 'dist', '.git']
  private extensionToRead = '.md'
  private errorWrongFolder = 'Folder to be processed does not exist'
  private errorNoReadmeFile = 'No README.md file found to be updated'
  private errorNoMoreFiles = 'No more documentation files found to be updated within README.md'
  private readmeFileContent = ''
  private readmeFileSection = ''
  private existingSectionIndex = 0;
  private existingSectionNextIndex = 0;

  constructor() {
    this.readDirAsync = util.promisify(fs.readdir)
    this.statAsync = util.promisify(fs.stat)
    this.readFileAsync = util.promisify(fs.readFile)
    this.updateReadmeFile = this.updateReadmeFile.bind(this)
    this.checkExistingSection = this.checkExistingSection.bind(this)
    this.checkExistingNextSection = this.checkExistingNextSection.bind(this)
    this.removeExistingSection = this.removeExistingSection.bind(this)
  }

  async createReadmeMore(baseFolder: string, docsFolder: string, section: string): Promise<void>  {
    this.readmeFileContent = await this.readReadmeFile(`${baseFolder}/README.md`)
    if (this.readmeFileContent === '') {
      console.error(this.errorNoReadmeFile)
      process.exit(1)
      return
    }

    this.readmeFileSection = section
    this.readFilesFromFolder(docsFolder, this.updateReadmeFile)
  }

  async readFilesFromFolder(folder: string, onReadFilesFromFolder: Function): Promise<void> {
    let results: string[] = []

    try {
      const readFilesList: string[] = await this.readDirAsync(folder)
      let totalFilesToRead = readFilesList.length

      if (!totalFilesToRead) {
        return onReadFilesFromFolder(null, results)
      }

      readFilesList
        .map(async(baseNameReadFile: string) => {
          let readFile = baseNameReadFile
          readFile = path.resolve(folder, readFile)

          const stat = await this.statAsync(readFile)

          if (stat && stat.isDirectory()) {
            this.readFilesFromFolder(readFile, (readFilesFromFolderError: Error, readData: string[]) => {
              if (!this.foldersToExlcude.includes(baseNameReadFile)) {
                results = results.concat(readData)
              }

              if (!--totalFilesToRead) {
                onReadFilesFromFolder(null, results)
              }
            })
          } else {
            if (readFile.indexOf(this.extensionToRead) >= 0 && path.basename(readFile) !== 'README.md') {
              results.push(readFile)
            }

            if (!--totalFilesToRead) {
              onReadFilesFromFolder(null, results)
            }
          }
        })
    } catch (readFilesFromFolderError) {
      onReadFilesFromFolder(readFilesFromFolderError, [])
    }
  }

  async readReadmeFile(file: string): Promise<string> {
    try {
      return await this.readFileAsync(file, 'utf8')

    } catch (readReadmeFileError) {
      return ''
    }
  }

  async updateReadmeFile(readError: Error, readFiles: string[]): Promise<void> {
    if (readError) {
      console.error(this.errorWrongFolder)
      process.exit(1)
      return
    }

    if (readFiles.length <= 0) {
      console.error(this.errorNoMoreFiles)
      process.exit(1)
      return
    }

    readFiles = readFiles.map((readFile: string) => {
      const filePath = readFile.replace(`${process.cwd()}/`, '')
      return `[${path.parse(filePath).name}](${filePath})`
    })

    this.handleContentReadme(this.getRowsReadmeFile(this.readmeFileContent), readFiles)
  }

  private getRowsReadmeFile(contentFile: string): string[] {
    let rowsFile = contentFile.split('\n');
    rowsFile = rowsFile
      .map(row => row.trim())

    return rowsFile
  }

  private checkExistingSection(line: string, index: number): boolean {
    const regExpr = new RegExp(`^([#]+)[ ](${this.readmeFileSection})$`, 'gi')
    if (regExpr.test(line)) {
      this.existingSectionIndex = index + 1
      return true
    }
    return false
  }

  private checkExistingNextSection(line: string, index: number): boolean {
    const regExpr = new RegExp(/(^[#]+)/, 'gi')
    if (regExpr.test(line) && index > this.existingSectionIndex && this.existingSectionNextIndex === 0) {
      this.existingSectionNextIndex = index - 1
      return true
    }
    return false
  }

  private removeExistingSection(line: string, index: number): boolean {
    return index < this.existingSectionIndex || index > this.existingSectionNextIndex;
  }

  private handleContentReadme(readLines: string[], documentLines: string[]) {
    const isExistingSection = readLines.some(this.checkExistingSection)
    if (!isExistingSection) {
      this.existingSectionIndex = readLines.length - 1
      this.existingSectionNextIndex = readLines.length - 1
      documentLines.splice(0, 0, ' ', `# ${this.readmeFileSection}`)
    }

    const isExistingNextSection = readLines.some(this.checkExistingNextSection)
    if (!isExistingNextSection) {
      this.existingSectionNextIndex = readLines.length - 1
    }

    readLines.splice(this.existingSectionIndex, this.existingSectionNextIndex - this.existingSectionIndex, ...documentLines);
  }
}
