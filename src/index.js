'use strict'

// ANSI escape code colors.
const colors = [
  // 30, // Black
  31, // Red
  32, // Green
  33, // Yellow
  34, // Blue
  35, // Magenta
  36, // Cyan
  37 // White
]

/*
 * Based on visionmedia/debug module's selectColor method from
 * https://github.com/visionmedia/debug/blob/master/src/common.js
 */
function selectColor (namespace) {
  // 0x22222222 did not work well.
  let hash = 0x44444444
  let i

  for (i = 0; i < namespace.length; i++) {
    hash ^= namespace.charCodeAt(i) & namespace.charCodeAt(i) << 1
    hash |= 0
  }

  return colors[ Math.abs(hash) % colors.length ]
}

module.exports = function init (namespace, options = {}) {
  let lastCall = null
  let color = `\u001B[${selectColor(namespace)}m`
  let reset = '\u001B[0m'
  let patterns = []
  let pats = []

  if (typeof options.useColors !== 'boolean') {
    options.useColors = true
  }

  if (typeof options.realTime !== 'boolean') {
    options.realTime = false
  }

  if (typeof options.useISO !== 'boolean') {
    options.useISO = false
  }

  if (typeof options.spacingString !== 'string') {
    options.spacingString = ' '
  }

  if (typeof options.namespacePrefix !== 'string') {
    options.namespacePrefix = ''
  }

  if (typeof process.env.DEBUG !== 'undefined') {
    if (process.env.DEBUG.indexOf(',') !== -1) {
      pats = process.env.DEBUG.split(',')
    } else {
      pats.push(process.env.DEBUG)
    }

    pats.forEach((p) => {
      p = p.replace(/\*+/, '.*')

      if (p === '' || /[^*a-z0-9_.-]/i.test(p) || /(_|-){2,}/.test(p)) {
        console.error(`ERROR -- Invalid process.env.DEBUG pattern: "${p}"`)
      } else {
        // console.info(`Found process.env.DEBUG pattern ${p}`)

        patterns.push(p)
      }
    })
  }

  function buildMessage (options, format, now, diff, namespace, string, args) {
    let message = ''

    if (process.stderr.isTTY && options.useColors) {
      message = `${color}` +
        `${options.realTime ? new Date(now)[ options.useISO ? 'toISOString' : 'toUTCString' ]() : ''}` +
        `${reset}` +
        `${options.realTime === true ? options.spacingString : ''}` +
        `${color}` +
        `${options.namespacePrefix}` +
        `${typeof namespace === 'undefined' ? 'debug' : namespace}` +
        `${reset}` +
        `${options.spacingString}` +
        `${args.length > 0 ? format(string, ...args) : string}` +
        `${options.spacingString}` +
        `${color}` +
        `${options.realTime ? '' : format('+%dms', diff)}` +
        `${reset}\n`
    } else {
      message =
      `${options.realTime ? new Date(now)[ options.useISO ? 'toISOString' : 'toUTCString' ]() : ''}` +
      `${options.realTime === true ? options.spacingString : ''}` +
      `${options.namespacePrefix}` +
      `${typeof namespace === 'undefined' ? 'debug' : namespace}` +
      `${options.spacingString}` +
      `${args.length > 0 ? format(string, args) : string}` +
      `${options.spacingString}` +
      `${options.realTime === false ? format('+%dms', diff) : ''}\n`
    }

    return message
  }

  function customDebug (string) {
    let isEnabled = false
    let p

    for (p in patterns) {
      // console.info('patterns[ p @ %s ] = %s', p, patterns[ p ])

      if (patterns[ p ] === '*' || (patterns[ p ] !== '*' && RegExp(`^${patterns[ p ]}$`).test(namespace))) {
        isEnabled = true
      }
    }

    if (isEnabled && typeof process.env.DEBUG !== 'undefined') {
      const { format } = require('util')
      const args = Array.from(arguments).slice(1)
      let diff = 0
      let now = 0

      if (lastCall === null) {
        lastCall = Date.now()
      }

      now = Date.now()
      diff = now - lastCall

      const result = buildMessage(options, format, now, diff, namespace, string, args)

      process.stderr.write(result)

      lastCall = now
    }
  }

  return customDebug
}
