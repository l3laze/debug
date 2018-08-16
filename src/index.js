/**
 * @author Tom Shaver <l3l_aze@yahoo.com>
 * @description A small NodeJS module based on https://github.com/visionmedia/debug. Has colorized output in terminal for namespaces, formatted output, and ms timestamps.
 * @example
 *  const name = 'test1'
 *  const debug = require('lil-debug')(name)
 *
 *  debug('Testing %s', name)
 */

/**
 * @const colors
 * @description 8-bit terminal colors for the selectColor function.
 */
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

/**
 * @function
 * @argument {String} namespace - The namespace to create an instance for.
 * @returns {Number} - A color from the <colors> list.
 *
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

/**
 * @constructor
 * @description Initializes an instance of the debugger for the given namespace.
 * @argument {String} namespace - The namespace this is for.
 * @returns {Object} - The custom debug instance for the namespace.
 */
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

  if (typeof options.wideSpacing !== 'boolean') {
    options.wideSpacing = false
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

  function buildMessage (options, color, format, now, diff, namespace, string, args) {
    let message = ''

    if (process.stderr.isTTY && options.useColors) {
      message = `${options.realTime ? new Date(now).toISOString() + ' ' : ''}` +
        `${(options.wideSpacing && !options.realTime === false) ? '\t' : ''}` +
        `${color}` +
        `${options.namespacePrefix}` +
        `${typeof namespace === 'undefined' ? 'debug' : namespace} ` +
        `${reset}` +
        `${options.wideSpacing ? '\t' : ''}` +
        `${args.length > 0 ? format(string, ...args) : string} ` +
        `${options.wideSpacing ? '\t' : ''}` +
        `${color}` +
        `${options.realTime ? '' : format('+%dms', diff)}` +
        `${reset}\n`
    } else {
      message = `${options.realTime ? new Date(now).toISOString() : ''}` +
      `${(options.wideSpacing && !options.realTime === false) ? '\t' : ''}` +
      `${options.namespacePrefix}` +
      `${typeof namespace === 'undefined' ? 'debug' : namespace} ` +
      `${options.wideSpacing ? '\t' : ''}` +
      `${args.length > 0 ? format(string, args) : string} ` +
      `${options.wideSpacing ? '\t' : ''}` +
      `${options.realTime === false ? format('+%dms', diff) : ''}\n`
    }

    return message
  }

  /**
   * @description The function that handles the `debug()`` calls.
   */
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
      const format = require('util').format
      const args = Array.from(arguments).slice(1)
      let diff = 0
      let now = 0

      if (lastCall === null) {
        lastCall = Date.now()
      }

      now = Date.now()
      diff = now - lastCall

      const result = buildMessage(options, color, format, now, diff, namespace, string, args)

      process.stderr.write(result)

      lastCall = now
    }
  }

  return customDebug
}
