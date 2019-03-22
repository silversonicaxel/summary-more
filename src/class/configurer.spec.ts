import { Configurer, ConfigurerData } from './configurer'
import { assert, createSandbox } from 'sinon'
import * as program from 'commander'
import { expect } from 'chai'

describe('#Configurer', () => {
  let configurer: Configurer
  let sandboxSet: any
  const defaultProgramSection = 'Summary'
  program['docsSection'] = defaultProgramSection

  beforeEach(() => {
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
/*
    it('should return customized output folder', () => {
      const outputFolder = 'html/report/features'
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: '',
        outputFolder: outputFolder,
        theme: 'white'
      }
      program['analysis'] = ''
      program['output'] = outputFolder

      const data = configurer.fetchData()

      expect(data).to.deep.equal(expectedConfigurerData)
    })

    it('should return customized report theme', () => {
      const theme = 'black'
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: '',
        outputFolder: '',
        theme: theme
      }
      program['analysis'] = ''
      program['output'] = ''
      program['theme'] = theme

      const data = configurer.fetchData()

      expect(data).to.deep.equal(expectedConfigurerData)
    })

    it('should return default report theme', () => {
      const theme = 'white'
      const expectedConfigurerData = <ConfigurerData>{
        analysisFolder: '',
        outputFolder: '',
        theme: 'white'
      }
      program['analysis'] = ''
      program['output'] = ''
      program['theme'] = theme

      const data = configurer.fetchData()

      expect(data).to.deep.equal(expectedConfigurerData)
    })*/
  })
})
