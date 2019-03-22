import { Maker } from './maker'
import { assert, createSandbox } from 'sinon'
import * as util from 'util'
import * as fs from 'fs'
import { expect } from 'chai'

describe('#Configurer', () => {
  let maker: Maker
  let sandboxSet: any

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
})
