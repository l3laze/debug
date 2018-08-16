'use strict'

const debug = require('./../src/index.js')('ebug-test', {
  realTime: true
})

debug('Something something something...%s.', 'dark side')
