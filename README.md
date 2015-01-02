#broccoli-file-sieve

Broccoli plugin that filters files from the input tree.
Filtering uses glob patterns.

It also allows to change files paths in the output tree.

##Install

```
npm install broccoli-file-sieve
```

##Usage

```js
var sieve = require('broccoli-file-sieve')
 
//take all js files except files from 'node'
var js = sieve('src', {
  files: [
    '**/*.js',
    '!node/**'
  ]
})

module.exports = js
```

##API

###sieve(inputTree, options)

Creates plugin instance.

####inputTree

Type: `Tree`

Broccoli tree.

####options

Type: `object`

Object with options.

###List of options

####files

Type: `array.<string>`

List of glob patterns.
Patterns that begin with `!` will exclude files.
Patterns are processed in order, so inclusion and exclusion order is significant.

####srcDir

Type: `string`

Path in the input tree from where files will be copied.
This will be base path for glob patterns.

####destDir

Type: `string`

Path in the output tree where files will be copied.

####changeFilePath

Type: `function(string) -> string`

Function that takes relative path of each file and returns new path of this file.

##License

Public domain, see the `LICENCE.md` file.

