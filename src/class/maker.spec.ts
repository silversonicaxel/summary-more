import { Maker } from './maker'
import { assert, createSandbox, spy } from 'sinon'
import * as util from 'util'
import * as fs from 'fs'
import { expect } from 'chai';
import * as path from 'path'

describe('#Maker', () => {
  let maker: Maker
  let sandboxSet: any

  const baseFolder = 'bf'
  const docsFolder = 'df'
  const docsSection = 'Section'


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

    it('should initialize section', async () => {
      sandboxSet.stub(maker, 'readSummaryFile').returns('Some content')
      sandboxSet.stub(maker, 'readFilesFromFolder')
      await maker.applySummaryMore(baseFolder, docsFolder, docsSection)

      expect(maker['summaryFileSection']).to.equal(docsSection)
    })
  })
})
