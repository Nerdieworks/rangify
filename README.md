# Rangify (for ES6, with [ES5 compatibility](#user-content-ecmascript-5))

> Create range iterator from start/stop, string, or array.

Rangify uses __inclusive ranges__ (the last number is included) by default, because it will most likely parse user input. You go try to explain [exclusive ranges](http://stackoverflow.com/questions/4504662/why-does-rangestart-end-not-include-end) to a customer..

## How to use

Install by running `$ npm install rangify --save` and the parse a range. This package uses [tiny-range](https://www.npmjs.com/package/tiny-range) for parsing ranges.

```js
import range, {Range} from 'rangify'

let iter

// Basic example
for (let i of new Range(2, 10, 2)) {
	console.log(i) // 2, 4, 6, 8, 10
}

// Equivalent
for (let i of range('2~10', 2)) {
	console.log(i) // 2, 4, 6, 8, 10
}

// Helper function
iter = range('1, 3-5')    // from string
iter = range([1, [3, 5]]) // by array

// Iterating
iter.next().value // 1
iter.next().value // 3
iter.next().value // 4
iter.next().value // 5
iter.next() // { value: undefined, done: true }

// For loops
iter = range('-10~10')

for (let i of iter) {
	console.log(i) // -10, -9, ..., 9, 10
}

// Infinite ranges
for (let i of range('0-3, 100~')) {
	console.log(i) // 0, 1, 2, 3, 100, 101, 102, 103, etc.
	if (i > 110) break
}
```

Also see [Iteration Protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) for more info about JavaScript iterators.

## ECMAScript 5

No ES6 for you? Bummer, however you can still use rangify! You only need to include the BabelJS polyfill for this:

```js
// $ npm install babel --global
require('babel/polyfill')

var rangify = require('rangify/es5')
var range   = rangify['default']
var Range   = rangify.Range

var iter = range('1~10')
var item

while (item = iter.next().value) {
	console.log(item)
}
```

## Contributing

Any help or feedback is appreciated! Make sure you run the tests before doing a PR:

```bash
git clone https://github.com/Nerdieworks/rangify.git
cd rangify/
npm install
npm test
npm run build && npm test -- --es5 // for ES5
// "git add" etc.
```
