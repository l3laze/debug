/* eslint-env mocha */
'use strict'

const should = require('chai').should() // eslint-disable-line no-unused-vars

describe('ebug', function () {
  this.slow(0)

  describe('#require(\'ebug\')(\'namespace\', { useColors: false })', function initsOnRequire () {
    it('should return a function', async function initReturnsFunc () {
      this.timeout(4000)

      const debug = require('./../src/index.js')('ebug-test')
      
      debug.should.be.a('function')
    })
    
    it('should return a function', async function initReturnsFunc () {
      this.timeout(4000)

      const debug = require('./../src/index.js')('ebug-test', { useColors: false })
      
      debug.should.be.a('function')
    })
  })
})
