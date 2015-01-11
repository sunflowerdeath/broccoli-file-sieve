var fs = require('fs')
var path = require('path')

var mkdirp = require('mkdirp')
var quickTemp = require('quick-temp')
var symlinkOrCopy = require('symlink-or-copy')
var dirmatch = require('dirmatch')

var Sieve = function(inputTree, options) {
	if (!(this instanceof Sieve)) return new Sieve(inputTree, options)
	this.inputTree = inputTree
	if (!options) options = {}
	if (!options.files) options.files = ['**']
	this.options = options
}

Sieve.prototype.description = 'Sieve'

Sieve.prototype.read = function(readTree) {
	var _this = this
	return readTree(this.inputTree).then(function(srcDir) {
		if (_this.options.srcDir) srcDir = path.join(srcDir, _this.options.srcDir)

		var destDir = quickTemp.makeOrRemake(_this, 'destDir')
		var topDestDir = destDir
		if (_this.options.destDir) destDir = path.join(destDir, _this.options.destDir)

		var files = dirmatch(srcDir, _this.options.files)

		files.forEach(function(file) {
			var src = path.join(srcDir, file)
			var dest = _this.options.changeFilePath ? _this.options.changeFilePath(file) : file
			dest = path.join(destDir, dest)
			_this.copyFile(src, dest)
		})

		return topDestDir
	})
}

Sieve.prototype.cleanup = function() {
	quickTemp.remove(this, 'destDir')
}

Sieve.prototype.copyFile = function(src, dest) {
	var destDir = path.dirname(dest)
	if (!fs.existsSync(destDir)) mkdirp.sync(destDir)
	symlinkOrCopy.sync(src, dest)
}

module.exports = Sieve
