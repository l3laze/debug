'use strict'

const debug = require('./../src/index.js')('ebug-test', {
  namespacePrefix: '@ '
})

debug('Something something something...%s.', 'dark side')
