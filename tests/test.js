var assert = require('assert')
var path = require('path')
var fs = require('fs')
var broccoli = require('broccoli')
var glob = require('glob')

var sieve = require('../index.js')

describe('broccoli-file-sieve', function() {
	var DIR = path.join(__dirname, 'files')

	var builder

	var getFiles = function(dir) {
		return glob.sync('**', {cwd: dir, nodir: true})
	}

	afterEach(function() {
		if (builder) builder.cleanup()
	})

	it('copies input tree to output tree', function() {
		var tree = sieve(DIR)
		builder = new broccoli.Builder(tree)
		return builder.build().then(function(result) {
			assert.deepEqual(
				getFiles(result.directory),
				getFiles(DIR)
			)
		})
	})

	it('copies from options.srcDir of input tree', function() {
		var tree = sieve(DIR, {srcDir: 'dir'})
		builder = new broccoli.Builder(tree)
		return builder.build().then(function(result) {
			assert.deepEqual(
				getFiles(result.directory),
				getFiles(path.join(DIR, 'dir'))
			)
		})
	})

	it('copies to options.destDir', function() {
		var tree = sieve(DIR, {destDir: 'dir'})
		builder = new broccoli.Builder(tree)
		return builder.build().then(function(result) {
			assert.deepEqual(
				getFiles(path.join(result.directory, 'dir')),
				getFiles(DIR)
			)
		})
	})

	it('filters files with options.files', function() {
		var tree = sieve(DIR, {
			files: ['**/*.js']
		})
		builder = new broccoli.Builder(tree)
		return builder.build().then(function(result) {
			assert.deepEqual(
				getFiles(result.directory),
				['dir/file.js', 'index.js']
			)
		})
	})

	it('changes file paths with options.changeFilePath', function() {
		var CHANGED = 'c/h/a/n/g/e/d'

		var tree = sieve(DIR, {
			changeFilePath: function(file) {
				if (file === 'index.js') return CHANGED
				else return file
			}
		})
		builder = new broccoli.Builder(tree)
		return builder.build().then(function(result) {
			assert(fs.existsSync(path.join(result.directory, CHANGED)))
		})
	})

})
