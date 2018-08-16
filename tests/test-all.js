'use strict'

const debug = require('./../src/index.js')('ebug-test', {
  useColors: false,
  realTime: true,
  namespacePrefix: '@ ',
  wideSpacing: true
})

debug('Something something something...%s.', 'dark side')
