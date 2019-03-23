import { Configurer, ConfigurerData } from './configurer'
import { assert, createSandbox } from 'sinon'
import * as program from 'commander'
import { expect } from 'chai'

describe('#Configurer', () => {
  let configurer: Configurer
  let sandboxSet: any
  const defaultProgramSection = 'Summary'


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

    it('should throw an error due to missing mandatory parameters', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')
      delete program['docsSection']

      configurer['setupOptions']()

      assert.calledOnce(consoleStub)
      assert.calledWith(consoleStub, '-s, --docsSection required')
      assert.calledOnce(processStub)
      assert.calledWith(processStub, 1)
    })
  })

  describe('#fetchData', () => {
    it('should return configurer custom data', () => {
      const expectedConfigurerData = <ConfigurerData>{
        baseFolder: 'folder',
        docsFolder: 'subfolder',
        docsSection: defaultProgramSection
      }
      program['baseFolder'] = expectedConfigurerData.baseFolder
      program['docsFolder'] = expectedConfigurerData.docsFolder

      const data = configurer.fetchData()

      expect(data).to.deep.equal(expectedConfigurerData)
    })

    it('should return configurer default data', () => {
      const expectedConfigurerData = <ConfigurerData>{
        baseFolder: './',
        docsFolder: './',
        docsSection: defaultProgramSection
      }

      delete program['baseFolder']
      delete program['docsFolder']

      const data = configurer.fetchData()

      expect(data).to.deep.equal(expectedConfigurerData)
    })
  })
})
