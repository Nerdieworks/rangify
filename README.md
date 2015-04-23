# Rangify (for ES6, with [ES5 compatibility](#user-content-ecmascript-5))

> Create ES6 range iterator from start/stop number, string, or array.

Rangify uses [exclusive ranges](http://stackoverflow.com/questions/4504662/why-does-rangestart-end-not-include-end) (the last number is excluded).

## How to use

Install by running `$ npm install rangify --save` and the parse a range. This package uses [tiny-range](https://www.npmjs.com/package/tiny-range) for parsing ranges.

```js
import range, {Range} from 'rangify'

let iter, r

// Basic example
for (let i of new Range(2, 10, 2)) {
	console.log(i) // 2, 4, 6, 8
}

// Equivalent
for (let i of range('2~10', 2)) {
	console.log(i) // 2, 4, 6, 8
}

// Helper function
iter = range(1, 5)        // start/stop number (continuous range)
iter = range('1, 3~5')    // string
iter = range([1, [3, 5]]) // array

// NOTE: [1, [3, 5]] will become [[1, 1], [3, 5]],
// so [1, 3] equals '1, 3' and not '1~3'.

// Positive ranges, with dashes instead of tildes
iter = range('2, 4-6, 9-'.replace(/~/g, '').replace(/-/g, '~'))

// Iterating
iter.next().value // 1
iter.next().value // 3
iter.next().value // 4
iter.next() // { value: undefined, done: true }

// For..of loops
iter = range('-10~10')

for (let i of iter) {
	console.log(i) // -10, -9, …, 8, 9
}

// Infinite range
for (let i of range('0~3, 100~')) {
	console.log(i) // 0, 1, 2, 3, 100, 101, 102, …
	if (i > 110) break
}

console.log(new Range('1, 5').isFinite)  // true 
console.log(new Range('1, 5~').isFinite) // false

// Inclusive range
for (let i of range('0~3', true)) {
	console.log(i) // 0, 1, 2, 3
}

r = new Range('0~3', true)
console.log(r.inclusive) // true
r.inclusive = false      // exclusive again

// Step range
for (let i of range('0~3, 6~10, 50~', 2)) {
	console.log(i) // 0, 2, 6, 8, 10, 50, 52, 54, …
	if (i > 60) break
}
```

Also see [Iteration Protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) for more info about JavaScript iterators.

## ECMAScript 5

No ES6 for you? Bummer, however you can still use rangify! You only need to include the BabelJS polyfill for this:

```js
// $ npm install babel --global
require('babel/polyfill')

var rangify = require('rangify/polyfill')
var range   = rangify['default']
var Range   = rangify.Range

var iter = range('1~10')
var item

while (item = iter.next().value) {
	console.log(item) // 1, 2, …, 8, 9
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
