'use strict'

const debug = require('./src/index.js')('test', {
  namespacePrefix: '@',
  realTime: true,
  useISO: true,
  useColors: false,
  spacingString: '\t'
})

debug('Something something something...%s.', 'dark side')
