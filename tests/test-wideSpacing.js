'use strict'

const debug = require('./../src/index.js')('ebug-test', {
  wideSpacing: true
})

debug('Something something something...%s.', 'dark side')
