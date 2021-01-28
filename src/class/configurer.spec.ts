import { Configurer, ConfigurerData } from './configurer'
import { assert, createSandbox, SinonSpy } from 'sinon'
import * as program from 'commander'
import { expect } from 'chai'

Object.defineProperty(program, 'docsSection', {
  configurable: true,
  value: 'Summary'
})

describe('#Configurer', () => {
  const configurer = new Configurer()
  let sandboxSet: any
  const defaultProgramSection = 'Summary'
  const defaultHeadingLevel = undefined

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
    })
  })

  describe('#setupOptions', () => {
    let storeOptionsAsPropertiesStub: SinonSpy<any, any>
    let versionStub: SinonSpy<any, any>
    let allowUnknownOptionStub: SinonSpy<any, any>
    let optionStub: SinonSpy<any, any>
    let parseStub: SinonSpy<any, any>

    beforeEach(() => {
      storeOptionsAsPropertiesStub = sandboxSet.stub(program, 'storeOptionsAsProperties').returns(program)
      versionStub = sandboxSet.stub(program, 'version').returns(program)
      allowUnknownOptionStub = sandboxSet.stub(program, 'allowUnknownOption').returns(program)
      optionStub = sandboxSet.stub(program, 'option').returns(program)
      parseStub = sandboxSet.stub(program, 'parse').returns(program)
    })

    it('should not throw an error', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      configurer['setupOptions']()

      assert.notCalled(consoleStub)
      assert.notCalled(processStub)
      assert.calledOnce(storeOptionsAsPropertiesStub)
      assert.calledOnce(versionStub)
      assert.calledOnce(allowUnknownOptionStub)
      assert.callCount(optionStub, 4)
      assert.calledOnce(parseStub)
    })

    it('should setup the program options', () => {
      configurer['setupOptions']()

      expect(program).to.respondTo('storeOptionsAsProperties')
      expect(program).to.respondTo('version')
      expect(program).to.respondTo('allowUnknownOption')
      expect(program).to.respondTo('option')
      expect(program).to.respondTo('parse')
    })

    it('should throw an error due to missing mandatory docsSection parameter', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')

      Object.defineProperty(program, 'docsSection', {
        value: undefined
      })

      configurer['setupOptions']()

      assert.calledOnce(consoleStub)
      assert.calledWith(consoleStub, '-s, --docsSection required')
      assert.calledOnce(processStub)
      assert.calledWith(processStub, 1)

      Object.defineProperty(program, 'docsSection', {
        value: 'Summary'
      })
    })

    it('should throw an error due to wrong headingLevel parameter', () => {
      const consoleStub = sandboxSet.stub(console, 'error')
      const processStub = sandboxSet.stub(process, 'exit')
      Object.defineProperty(program, 'headingLevel', {
        configurable: true,
        value: 9
      })

      configurer['setupOptions']()

      assert.calledOnce(consoleStub)
      assert.calledWith(consoleStub, '-l, --headingLevel is not set correctly, it must be an integer between 1 and 6')
      assert.calledOnce(processStub)
      assert.calledWith(processStub, 1)

      Object.defineProperty(program, 'headingLevel', {
        value: undefined
      })
    })
  })

  describe('#fetchData', () => {
    it('should return configurer default data', () => {
      const expectedConfigurerData = <ConfigurerData>{
        baseFolder: './',
        docsFolder: './',
        docsSection: defaultProgramSection,
        headingLevel: defaultHeadingLevel
      }

      const data = configurer.fetchData()

      expect(data).to.deep.equal(expectedConfigurerData)
    })

    it('should return configurer custom data', () => {
      const expectedConfigurerData = <ConfigurerData>{
        baseFolder: 'folder',
        docsFolder: 'subfolder',
        docsSection: defaultProgramSection,
        headingLevel: 3
      }
      Object.defineProperty(program, 'baseFolder', {
        value: expectedConfigurerData.baseFolder
      })
      Object.defineProperty(program, 'docsFolder', {
        value: expectedConfigurerData.docsFolder
      })
      Object.defineProperty(program, 'headingLevel', {
        value: expectedConfigurerData.headingLevel
      })

      const data = configurer.fetchData()

      expect(data).to.deep.equal(expectedConfigurerData)
    })
  })
})
