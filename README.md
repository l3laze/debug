# ebug
A mini NodeJS debug module based on https://github.com/visionmedia/debug. Has colorized output in terminal for namespaces, formatted output, and millisecond timestamps between calls within the same module.

[![< 5 kB](https://badge-size.herokuapp.com/l3laze/ebug/master/src/index.js)](https://github.com/l3laze/ebug/src/index.js)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/042bd18597844277946a6063cdd14cc2)](https://www.codacy.com/project/l3laze/ebug/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=l3laze/ebug&amp;utm_campaign=Badge_Grade_Dashboard)


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


## **Notes**:
* Black (30) has been removed from the list of colors available for now. Will return with background coloring included in a future update, unless I can find some way to get the background color of the terminal..

* Uses [util.format](https://nodejs.org/api/util.html#util_util_format_format_args) internally, so can do any of the formatting available there.
