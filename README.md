# ebug
A mini NodeJS debug module based on https://github.com/visionmedia/debug.


[![NPM](https://nodei.co/npm/ebug.png?compact=true)](https://nodei.co/npm/ebug/)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/042bd18597844277946a6063cdd14cc2)](https://www.codacy.com/project/l3laze/ebug/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=l3laze/ebug&amp;utm_campaign=Badge_Grade_Dashboard)
[![CodeCov](https://img.shields.io/codecov/c/github/l3laze/ebug/master.svg)](https://github.com/l3laze/ebug)

[![Appveyor Build Status](https://ci.appveyor.com/api/projects/status/github/l3laze/ebug?branch=master&svg=true)](https://ci.appveyor.com/project/l3laze/ebug)
[![Linux and Mac Build Status](https://travis-ci.org/l3laze/ebug.svg?branch=master)](https://travis-ci.org/l3laze/ebug)

[![Known Vulnerabilities](https://snyk.io/test/github/l3laze/ebug/badge.svg)](https://snyk.io/test/github/l3laze/ebug)

[![Dependencies](https://img.shields.io/david/l3laze/ebug.svg)](https://github.com/l3laze/ebug)

[![Dev Dependencies](https://img.shields.io/david/dev/l3laze/ebug.svg)](https://github.com/l3laze/ebug)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)


#### Optional Features

 * Terminal coloring for namespace & timestamps.
 * Real time timestamp of call to `ebug` or millisecond
difference of timestamps between calls to `ebug`
for the given namespace.
 * Optional global namespace prefix for messages.
 * Custom string for spacing around namespaces in messages.
 * Uses [util.format](https://nodejs.org/api/util.html#util_util_format_format_args)
internally, so all of the formatting there is available.


----


## **Usage**


1. Initialize with the debugging namespace of the module (which will be colorized in terminal output).
2. Run with the DEBUG environment variable properly set for the given module, or multiple modules, to see output.


### **`test.js`**

```javascript
// Using default options
const debug = require('ebug')('test')

// With custom options
const debug = require('ebug')('test', {
  namespacePrefix: '@',
  realTime: true,
  useISO: true,
  useColors: false,
  spacingString: '\t'
})

debug('Something something something...%s.', 'dark side')
```


### **`terminal/command line`**

**Output With Default Options** (coloring added by markdown formatting for example effect)

```javascript
DEBUG=test node test.js
  test Something something something...dark side. +0ms
```


**Output From Custom Options Above** (coloring removed for example effect)

```log
DEBUG=test node test.js
2018-08-17T10:17:50.411Z	@test	Something something something...dark side.
```


----


**Using A Wildcard For `process.env.DEBUG`** (coloring added by markdown formatting for example effect)

```javascript
DEBUG=test*,*test,*test* node test.js

test Something something something...dark side. +0ms
```


> In the above example each of test\*, \*test, and \*test\* matches the namespace test.


----

## **Options**

| Name | Default | Explanation |
| --- | --- | --- |
| `namespacePrefix` | '' | Prepended to namespaces in messages. |
| `realTime` | false | Use real timestamps instead of millisecond difference.|
| `useISO` | false | Use ISO timestamps instead of UTC. |
| `useColors` | true | Use colors for terminal output. |
| `spacingString` | ' ' | Custom spacing around namespace in messages. |


## **Note**

Black (30) has been removed from the list of colors available for now. Will return with background coloring included in a future update, unless I can find some way to get the background color of the terminal..
