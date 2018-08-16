'use strict'

const debug = require('./../src/index.js')('ebug-test', {
  useColors: false,
  realTime: true,
  namespacePrefix: '@ ',
  wideSpacing: true
})

const dashes = ('-'.repeat(Math.max(1, Math.floor(process.stdout.columns - __filename.length * 1.25))))
console.info('\nTest file %s %s\nenv.DEBUG %s [ %s ]\n', dashes, __filename, dashes, process.env.DEBUG.split(',').join(', '))
debug('Something something something...%s.', 'dark side')
