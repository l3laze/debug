/* eslint-env mocha */
'use strict'

const should = require('chai').should() // eslint-disable-line no-unused-vars
const { spawn } = require('child_process')

/*
 * Based on https://stackoverflow.com/a/18543419/7665043
 */
function captureStream (stream, allowEcho) {
  var oldWrite = stream.write
  var buf = ''

  if (typeof allowEcho !== 'boolean') {
    allowEcho = true
  }

  stream.write = function (chunk, encoding, callback) {
    buf += chunk.toString() // chunk is a String or Buffer
    if (allowEcho === true) {
      oldWrite.apply(stream, arguments)
    }
  }

  return {
    unhook: function unhook () {
      stream.write = oldWrite
    },
    captured: function captured () {
      return buf
    }
  }
}

describe('ebug', function () {
  this.slow(0)

  let hook
  let debug

  beforeEach(function () {
    hook = captureStream(process.stderr, false)
  })

  afterEach(function () {
    hook.unhook()
  })

  describe('#require(\'ebug\')(\'namespace\')', function initsOnRequire () {
    it('should return a function', function initReturnsFunc () {
      debug = require('./../src/index.js')('ebug-test')

      debug.should.be.a('function')
    })
  })

  describe('#require(\'ebug\')(\'namespace\', { \'customOptions\': \'...\' })', function canUseOptions () {
    it('should not use colors when disabled', function canDisableColors () {
      debug = require('./../src/index.js')('ebug-test', {
        useColors: false
      })

      debug('Hello, %s!', 'world')

      const result = hook.captured().replace(/\n$/, '')

      // console.info(result)

      result.should.not.include('\u001B[')
    })

    it('should not use real time when disabled', function canDisableRealTime () {
      debug = require('./../src/index.js')('ebug-test', {
        realTime: false
      })

      debug('Hello, %s!', 'world')

      const result = hook.captured().replace(/\n$/, '');

      // console.info(result);

      (function () {
        const date = Date(result.split(' ')[ 0 ])

        return function () {
          if (date) {
            throw new Error('This should not have returned')
          }
        }
      }()).should.throw()
    })

    it('should use ISO timestamps when enabled', function canUseISOTimestamps () {
      debug = require('./../src/index.js')('ebug-test', {
        realTime: true,
        useISO: true,
        useColors: false
      })

      debug('Hello, %s!', 'world')

      const captured = hook.captured().replace(/\n$/, '')
      const result = captured.split(' ')[ 0 ];

      // console.info('"%s"', result)

      (/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(result)).should.equal(true)
    })

    it('should use custom spacing when defined', function canUseCustomSpacing () {
      debug = require('./../src/index.js')('ebug-test', {
        spacingString: '\t'
      })

      debug('Hello, %s!', 'world')

      const captured = hook.captured().replace(/\n$/, '')
      const result = captured.substring(captured.indexOf('Hello, world!') - 1, captured.indexOf('Hello, world!'))

      // console.info('"%s"\n"%s"', captured, result)

      result.should.equal('\t')
    })

    it('should use a namespace prefix when defined', function canUsePrefix () {
      debug = require('./../src/index.js')('ebug-test', {
        namespacePrefix: '@ ',
        useColors: false
      })

      debug('Hello, %s!', 'world')

      const captured = hook.captured().replace(/\n$/, '')
      // To remove line up to ascii escape code for color before the @
      const result = captured.split(' ')[ 0 ].replace(/.*(\[3[0-7]{1}m)*?@/, '@')

      // console.info('"%s"', result)

      result.should.equal('@')
    })
  })

  describe('#process.env.DEBUG=name,spaces', function handlesErrors () {
    it('should log an error message for bad process.env.DEBUG args', function doesntLikeBadEnv (done) {
      this.timeout(5000)

      debug = require('./../src/index.js')('ebug-test')

      const testFile = require('path').join(__dirname, require('path').sep, 'test-errors.js')

      // console.info('Test file: %s', testFile)

      const penv = Object.create(process.env)

      penv.DEBUG = '\'h|i\',\'H"i\',\'h^i\',\'h**i\',ebug*,\'h__i\',\'h--i\''

      const spawned = spawn(
        'node',
        [ testFile ],
        { env: penv }
      )

      spawned.stderr.on('data', (chunk) => {
        const chunks = chunk.toString().replace(/\n$/, '').split('\n')

        for (let c of chunks) {
          if (c.indexOf('ebug-test') === -1) {
            c.should.include('Invalid process.env.DEBUG pattern')
          }
        }
      })

      spawned.on('exit', (code, signal) => {
        if (code === 0 && signal !== 'null') {
          done()
        } else {
          done(new Error(require('util').format('Child process exited with code %s and signal %s.', code, signal)))
        }
      })
    })
  })
})
