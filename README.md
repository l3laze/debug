# ebug
A mini NodeJS debug module based on https://github.com/visionmedia/debug.


[![NPM](https://nodei.co/npm/ebug.png?compact=true)](https://nodei.co/npm/ebug/)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/042bd18597844277946a6063cdd14cc2)](https://www.codacy.com/project/l3laze/ebug/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=l3laze/ebug&amp;utm_campaign=Badge_Grade_Dashboard)


#### Supports

 * Terminal coloring for namespace & timestamps.
 * ISO timestamp of call to ebug or millisecond
difference of timestamps between calls to ebug
for the given namespace.
 * Optional global namespace prefix for messages. Defaults to nothing.
 * Custom string for spacing around namespaces in messages. Defaults to a single space.
 * Uses [util.format](https://nodejs.org/api/util.html#util_util_format_format_args)
internally, so all of the formatting there is available.


----


## **Usage**


**test.js**

> Initialize with the debugging namespace of the module (which will be colorized in terminal output). Then use it.

```javascript
// Using default options
const debug = require('ebug')('test')

// With custom options
const debug = require('ebug')('test', {
  namespacePrefix: '@ ',
  realTime: true,
  useColors: false,
  wideSpacing: true
})

// ...

debug('Something something something...%s.', 'dark side')
```

> Run with the DEBUG environment variable properly set for the given module, or multiple modules, to see output.


**Output From Default Options** (any coloring is from the markdown renderer, and is not actual terminal coloring from the module)

```
DEBUG=test node ./test.js
  test Something something something...dark side. +0ms
```


**Output From Custom Options Above** (any coloring is from the markdown renderer, and is not actual terminal coloring from the module)

```
DEBUG=test node ./test.js
  2018-08-16T07:22:03.844Z	@ test	Something something something...dark side.
```


**Using A Wildcard For `process.env.DEBUG`** (again - any coloring is from markdown, yadda yadda)

```
DEBUG=test*,*test,*test* node ./test.js

test Something something something...dark side. +0ms
```


> In the above example each of test\*, \*test, and \*test\* matches the namespace test.


----

## **Options**

 


## **Notes**

* Black (30) has been removed from the list of colors available for now. Will return with background coloring included in a future update, unless I can find some way to get the background color of the terminal..
