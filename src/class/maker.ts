import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

export class Maker {
  private readDirAsync: Function
  private statAsync: Function
  private readFileAsync: Function
  private writeFileAsync: Function
  private foldersToExlcude: string[] = ['node_modules', 'dist', '.git']
  private extensionToRead = '.md'
  private summaryFileName = 'README.md'
  private summaryFileFolder = ''
  private summaryDocumentationFolder = ''
  private summaryFileContent = ''
  private summaryFileSection = ''
  private errorWrongFolder = 'Folder to be processed does not exist'
  private errorNoSummaryFile = `No summary file ${this.summaryFileName} found to be updated`
  private errorNoMoreFiles = `No more documentation files found to be updated in ${this.summaryFileName}`
  private existingSectionIndex = 0
  private existingSectionNextIndex = 0

  constructor() {
    this.readDirAsync = util.promisify(fs.readdir)
    this.statAsync = util.promisify(fs.stat)
    this.readFileAsync = util.promisify(fs.readFile)
    this.writeFileAsync = util.promisify(fs.writeFile)
    this.updateSummaryFile = this.updateSummaryFile.bind(this)
    this.checkExistingSection = this.checkExistingSection.bind(this)
    this.checkExistingNextSection = this.checkExistingNextSection.bind(this)
    this.removeExistingSection = this.removeExistingSection.bind(this)
  }

  async applySummaryMore(baseFolder: string, docsFolder: string, section: string): Promise<void>  {
    this.summaryFileFolder = path.resolve(baseFolder)
    this.summaryDocumentationFolder = path.resolve(baseFolder, docsFolder)

    this.summaryFileContent = await this.readSummaryFile(`${baseFolder}/${this.summaryFileName}`)
    if (this.summaryFileContent === '') {
      console.error(this.errorNoSummaryFile)
      process.exit(1)
      return
    }

    this.summaryFileSection = section
    this.readFilesFromFolder(this.summaryDocumentationFolder, this.updateSummaryFile)
  }

  private async readFilesFromFolder(folder: string, onReadFilesFromFolder: Function): Promise<void> {
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
            if (readFile.indexOf(this.extensionToRead) >= 0 && path.basename(readFile) !== this.summaryFileName) {
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

  private async readSummaryFile(file: string): Promise<string> {
    try {
      return await this.readFileAsync(file, 'utf8')

    } catch (readSummaryFileError) {
      return ''
    }
  }

  private async writeSummaryFile(file: string, contentFile: string): Promise<boolean> {
    try {
      await this.writeFileAsync(file, contentFile, 'utf8')
      return true

    } catch (writeSummaryFileError) {
      return false
    }
  }

  private updateSummaryFile(readError: Error, readFiles: string[]): void {
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
      const filePath = readFile.replace(`${this.summaryFileFolder}/`, '')
      return `* [${path.parse(filePath).name}](${filePath})`
    })

    this.handleSummaryContent(this.getRowsFromFileContent(this.summaryFileContent), readFiles)
  }

  private getRowsFromFileContent(contentFile: string): string[] {
    let rowsFile = contentFile.split('\n')
    rowsFile = rowsFile
      .map(row => row.trim())

    return rowsFile
  }

  private getContentFromRows(rowsFile: string[]): string {
    return rowsFile.join('\n')
  }

  private checkExistingSection(line: string, index: number): boolean {
    const regExpr = new RegExp(`^([#]+)[ ](${this.summaryFileSection})$`, 'gi')
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
    return index < this.existingSectionIndex || index > this.existingSectionNextIndex
  }

  private async handleSummaryContent(readLines: string[], documentLines: string[]) {
    const isExistingSection = readLines.some(this.checkExistingSection)
    if (!isExistingSection) {
      this.existingSectionIndex = readLines.length - 1
      this.existingSectionNextIndex = readLines.length - 1
      documentLines.splice(0, 0, ' ', `# ${this.summaryFileSection}`)
    }

    const isExistingNextSection = readLines.some(this.checkExistingNextSection)
    if (!isExistingNextSection) {
      this.existingSectionNextIndex = readLines.length - 1
    }

    readLines.splice(this.existingSectionIndex, this.existingSectionNextIndex - this.existingSectionIndex, ...documentLines)

    await this.writeSummaryFile(`${this.summaryFileFolder}/${this.summaryFileName}`, this.getContentFromRows(readLines))
  }
}
