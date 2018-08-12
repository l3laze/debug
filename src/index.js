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
function init (namespace) {
  let result
  let lastCall = null
  let color = `\u001B[${selectColor(namespace)}m`
  let reset = '\u001B[0m'

  /**
   * @internal
   * @description The function that handles the `debug()`` calls.
   */
  function customDebug (string) {
    let pattern

    if (typeof process.env.DEBUG !== 'undefined' &&
        (process.env.DEBUG === '*' ||
        RegExp(pattern).test(namespace))) {
      const format = require('util').format
      const args = Array.from(arguments).slice(1)
      let diff = 0
      let now = 0

      if (lastCall === null) {
        lastCall = Date.now()
      }

      now = Date.now()
      diff = now - lastCall

      if (process.stdout.isTTY) {
        result = `  ${color}${typeof namespace === 'undefined' ? 'debug' : namespace}${reset} ${args.length > 0 ? format(string, ...args) : string} ${color}${format('+%dms', diff)}${reset}\n`
      } else {
        result = `  ${typeof namespace === 'undefined' ? 'debug' : namespace} ${args.length > 0 ? format(string, args) : string} ${format('+%dms', diff)}\n`
      }

      process.stdout.write(result)

      lastCall = now
    }
  }

  return customDebug
}

module.exports = init
