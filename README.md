# ebug
A mini NodeJS debug module based on https://github.com/visionmedia/debug. Has colorized output in terminal for namespaces, formatted output, and millisecond timestamps between calls within the same module.


## **Usage**

```
const debug = require('ebug')('test')

debug('Something something something...%s.', 'dark side')

// test Something something something...dark side. +0ms
```

Uses [util.format](https://nodejs.org/api/util.html#util_util_format_format_args) internally, so can do any of the formatting available there.
