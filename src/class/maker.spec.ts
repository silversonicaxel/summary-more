import { Maker } from './maker'
import { assert, createSandbox, spy } from 'sinon'
import * as util from 'util'
import * as fs from 'fs'
import { expect } from 'chai'
import * as path from 'path'

describe('#Maker', () => {
  let maker: Maker
  let sandboxSet: any

  const baseFolder = 'bf'
  const docsFolder = 'df'
  const docsSection = 'Section'
  let executeWhenRead: Function

  beforeEach(() => {
    maker = new Maker()
    sandboxSet = createSandbox()
  })

  afterEach(() => {
    sandboxSet.restore()
  })

  describe('#constructor', () => {
    it('should setup promisify functionalities', () => {
      const promisifyStub = sandboxSet.stub(util, 'promisify')
      const scopedMaker = new Maker()

      assert.calledWith(promisifyStub, fs.readdir)
      assert.calledWith(promisifyStub, fs.stat)
    })
  })

  describe('#applySummaryMore', () => {
    it('should initialize folders in use', () => {
      sandboxSet.stub(maker, 'readSummaryFile')
      sandboxSet.stub(maker, 'readFilesFromFolder')
      maker.applySummaryMore(baseFolder, docsFolder, docsSection)

      expect(maker['summaryFileFolder']).to.equal(path.resolve(baseFolder))
    })

    it('should read summary file with no error', async () => {
      const readSummaryFileStub = sandboxSet.stub(maker, 'readSummaryFile').returns('Some content')
      sandboxSet.stub(maker, 'readFilesFromFolder')
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      await maker.applySummaryMore(baseFolder, docsFolder, docsSection)

      assert.calledOnce(readSummaryFileStub)
      assert.calledWith(readSummaryFileStub, `${baseFolder}/${maker['summaryFileName']}`)
      assert.notCalled(consoleStub)
      assert.notCalled(processStub)
    })

    it('should read summary file with an error', async () => {
      const readSummaryFileStub = sandboxSet.stub(maker, 'readSummaryFile').returns('')
      sandboxSet.stub(maker, 'readFilesFromFolder')
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      await maker.applySummaryMore(baseFolder, docsFolder, docsSection)

      assert.calledOnce(readSummaryFileStub)
      assert.calledWith(readSummaryFileStub, `${baseFolder}/${maker['summaryFileName']}`)
      assert.calledOnce(consoleStub)
      assert.calledWith(consoleStub, maker['errorNoSummaryFile'])
      assert.calledOnce(processStub)
      assert.calledWith(processStub, 1)
    })

    it('should initialize section', async () => {
      sandboxSet.stub(maker, 'readSummaryFile').returns('Some content')
      sandboxSet.stub(maker, 'readFilesFromFolder')
      await maker.applySummaryMore(baseFolder, docsFolder, docsSection)

      expect(maker['summaryFileSection']).to.equal(docsSection)
    })

    it('should read documents from folder', async () => {
      sandboxSet.stub(maker, 'readSummaryFile').returns('Some content')
      const readFilesFromFolderStub = sandboxSet.stub(maker, 'readFilesFromFolder')
      await maker.applySummaryMore(baseFolder, docsFolder, docsSection)

      assert.calledOnce(readFilesFromFolderStub)
      assert.calledWith(readFilesFromFolderStub, maker['summaryDocumentationFolder'], maker['updateSummaryFile'])
    })
  })

  describe('#readFilesFromFolder', () => {
    beforeEach(() => {
      executeWhenRead = () => { }
    })

    it('should read the initial folder', async () => {
      await maker['readFilesFromFolder'](docsFolder, executeWhenRead)

      expect(maker).to.respondTo('readDirAsync')
      expect(fs).to.respondTo('readdir')
    })

    it('should read folders recursively', async () => {
      await maker['readFilesFromFolder'](docsFolder, executeWhenRead)

      expect(path).to.respondTo('resolve')
      expect(maker).to.respondTo('statAsync')
      expect(maker).to.respondTo('readFilesFromFolder')
    })

    it('should manage error without thrown exception if folders does not exist', async () => {
      let readFilesFromFolderError

      try {
        await maker['readFilesFromFolder']('./not-existing-folder', executeWhenRead)
      } catch (error) {
        readFilesFromFolderError = error
      }

      expect(readFilesFromFolderError).to.equal(undefined)
    })
  })
})
