import { Configurer, ConfigurerData } from './configurer.js'
import { assert, createSandbox } from 'sinon'
import { Command } from 'commander'
import { expect } from 'chai'

const defaultProgramSection = 'Summary'
const defaultHeadingLevel = ''

process.argv.push('--docsSection', defaultProgramSection)

describe('#Configurer', () => {
  let sandboxSet: any

  beforeEach(() => {
    sandboxSet = createSandbox()
  })

  afterEach(() => {
    sandboxSet.restore()
  })

  describe('#constructor', () => {
    it('should setup configurer options', () => {
      const setupOptionsStub = sandboxSet.stub(Configurer.prototype, 'setupOptions')
      const scopedConfigurer = new Configurer()

      assert.calledOnce(setupOptionsStub)
      assert.calledWith(setupOptionsStub)

      expect(scopedConfigurer.program).to.not.equal(null)
    })
  })

  describe('#setupOptions', () => {
    let program: Command

    beforeEach(() => {
      const scopedConfigurer = new Configurer()
      program = scopedConfigurer.program
      sandboxSet.stub(program, 'storeOptionsAsProperties').returns(program)
      sandboxSet.stub(program, 'version').returns(program)
      sandboxSet.stub(program, 'allowUnknownOption').returns(program)
      sandboxSet.stub(program, 'option').returns(program)
      sandboxSet.stub(program, 'parse').returns(program)
    })

    it('should not throw an error', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      assert.notCalled(consoleStub)
      assert.notCalled(processStub)
    })

    it('should setup the program options', () => {
      expect(program).to.respondTo('storeOptionsAsProperties')
      expect(program).to.respondTo('version')
      expect(program).to.respondTo('allowUnknownOption')
      expect(program).to.respondTo('option')
      expect(program).to.respondTo('parse')
    })

    it('should throw an error due to missing mandatory docsSection parameter', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      process.argv.push('--docsSection', '')

      new Configurer()

      assert.calledOnce(consoleStub)
      assert.calledWith(consoleStub, '-s, --docsSection required')
      assert.calledOnce(processStub)
      assert.calledWith(processStub, 1)

      process.argv.push('--docsSection', defaultProgramSection)
    })

    it('should throw an error due to wrong headingLevel parameter', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      process.argv.push('--headingLevel', '9')

      new Configurer()

      assert.calledOnce(consoleStub)
      assert.calledWith(consoleStub, '-l, --headingLevel is not set correctly, it must be an integer between 1 and 6')
      assert.calledOnce(processStub)
      assert.calledWith(processStub, 1)

      process.argv.push('--headingLevel', '')
    })
  })

  describe('#fetchData', () => {
    it('should return configurer default data', () => {
      const scopedConfigurer = new Configurer()

      const expectedConfigurerData = <ConfigurerData>{
        baseFolder: './',
        docsFolder: './',
        docsSection: defaultProgramSection,
        headingLevel: defaultHeadingLevel
      }

      const data = scopedConfigurer.fetchData()

      expect(data.baseFolder).to.deep.equal(expectedConfigurerData.baseFolder)
      expect(data.docsFolder).to.deep.equal(expectedConfigurerData.docsFolder)
      expect(data.docsSection).to.deep.equal(expectedConfigurerData.docsSection)
      expect(data.headingLevel).to.deep.equal(NaN)
    })

    it('should return configurer custom data', () => {
      const expectedConfigurerData = <ConfigurerData>{
        baseFolder: 'folder',
        docsFolder: 'subfolder',
        docsSection: defaultProgramSection,
        headingLevel: '3'
      }

      process.argv.push('--baseFolder', expectedConfigurerData.baseFolder)
      process.argv.push('--docsFolder', expectedConfigurerData.docsFolder)
      process.argv.push('--headingLevel', expectedConfigurerData.headingLevel)

      const scopedConfigurer = new Configurer()

      const data = scopedConfigurer.fetchData()

      expect(data.baseFolder).to.deep.equal(expectedConfigurerData.baseFolder)
      expect(data.docsFolder).to.deep.equal(expectedConfigurerData.docsFolder)
      expect(data.docsSection).to.deep.equal(expectedConfigurerData.docsSection)
      expect(String(data.headingLevel)).to.deep.equal(expectedConfigurerData.headingLevel)
    })
  })
})
