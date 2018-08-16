'use strict'

const debug = require('./../src/index.js')('ebug-test', {
  useColors: false
})

debug('Something something something...%s.', 'dark side')
