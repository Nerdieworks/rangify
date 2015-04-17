// Babel polyfill is required for ES6 generators
try {
	require('babel-core/polyfill')
} catch (e) {
	require('babel/polyfill')
}

module.exports = require('./rangify')
