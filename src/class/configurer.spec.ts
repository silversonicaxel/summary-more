import { Configurer, ConfigurerData } from './configurer'
import { assert, createSandbox } from 'sinon'
import * as program from 'commander'
import { expect } from 'chai'

describe('#Configurer', () => {
  let configurer: Configurer
  let sandboxSet: any
  const defaultProgramSection = 'Summary'
  const defaultHeadingLevel = undefined


  beforeEach(() => {
    program['docsSection'] = defaultProgramSection

    configurer = new Configurer()
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
    })
  })

  describe('#setupOptions', () => {
    it('should setup the program options', () => {
      configurer['setupOptions']()

      expect(program).to.respondTo('version')
      expect(program).to.respondTo('allowUnknownOption')
      expect(program).to.respondTo('option')
      expect(program).to.respondTo('parse')
    })

    it('should not throw an error', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      configurer['setupOptions']()

      assert.notCalled(consoleStub)
      assert.notCalled(processStub)
    })

    it('should throw an error due to missing mandatory docsSection parameter', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')
      delete program['docsSection']

      configurer['setupOptions']()

      assert.calledOnce(consoleStub)
      assert.calledWith(consoleStub, '-s, --docsSection required')
      assert.calledOnce(processStub)
      assert.calledWith(processStub, 1)
    })

    it('should throw an error due to wrong headingLevel parameter', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')
      program['headingLevel'] = 9

      configurer['setupOptions']()

      delete program['headingLevel']

      assert.calledOnce(consoleStub)
      assert.calledWith(consoleStub, '-l, --headingLevel is not set correctly, it must be an integer between 1 and 6')
      assert.calledOnce(processStub)
      assert.calledWith(processStub, 1)
    })
  })

  describe('#fetchData', () => {
    it('should return configurer custom data', () => {
      const expectedConfigurerData = <ConfigurerData>{
        baseFolder: 'folder',
        docsFolder: 'subfolder',
        docsSection: defaultProgramSection,
        headingLevel: 3
      }
      program['baseFolder'] = expectedConfigurerData.baseFolder
      program['docsFolder'] = expectedConfigurerData.docsFolder
      program['headingLevel'] = expectedConfigurerData.headingLevel

      const data = configurer.fetchData()

      expect(data).to.deep.equal(expectedConfigurerData)
    })

    it('should return configurer default data', () => {
      const expectedConfigurerData = <ConfigurerData>{
        baseFolder: './',
        docsFolder: './',
        docsSection: defaultProgramSection,
        headingLevel: defaultHeadingLevel
      }

      delete program['baseFolder']
      delete program['docsFolder']
      delete program['headingLevel']

      const data = configurer.fetchData()

      expect(data).to.deep.equal(expectedConfigurerData)
    })
  })
})
