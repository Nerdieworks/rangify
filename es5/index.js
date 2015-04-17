// Babel polyfill is required for ES6 generators
try {
	require('babel-core/polyfill')
} catch (e) {
	require('babel/polyfill')
}

var rangify  = require('./rangify')
var extend   = require('extend')
var polyfill = function () {
	var range  = rangify['default'].apply(null, Array.prototype.slice.call(arguments))
	range.next = range._invoke
	return range
}

Object.defineProperty(polyfill, '__esModule', { value: true })
extend(polyfill, rangify)

module.exports = polyfill
