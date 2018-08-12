# ebug
A mini NodeJS debug module based on https://github.com/visionmedia/debug. Has colorized output in terminal for namespaces, formatted output, and millisecond timestamps between calls within the same module.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/042bd18597844277946a6063cdd14cc2)](https://www.codacy.com/project/l3laze/ebug/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=l3laze/ebug&amp;utm_campaign=Badge_Grade_Dashboard)


----


## **Usage**


**test.js**

> Initialize with the debugging namespace of the module (which will be colorized in terminal output). Then use it.

```
const debug = require('ebug')('test')

// ...

debug('Something something something...%s.', 'dark side')
```

> Run with the DEBUG environment variable properly set to see output.

**Terminal Output** (without colors)

```
DEBUG=test node ./test.js
  test Something something something...dark side. +0ms
```

**Using A Wildcard** (again, without colors)

```
DEBUG=te*t node ./test.js

test Something something something...dark side. +0ms
```

----


## **Notes**:
* Black (30) has been removed from the list of colors available for now. Will return with background coloring included in a future update, unless I can find some way to get the background color of the terminal..

* Uses [util.format](https://nodejs.org/api/util.html#util_util_format_format_args) internally, so can do any of the formatting available there.
