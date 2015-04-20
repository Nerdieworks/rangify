import should from 'should'
import rangeArray from 'range'

let iter, r, j

// Load Rangify
let es5Mode = (process.argv.filter((flag) => flag === '--es5').length > 0)
let {default: range, Range} = require(es5Mode ? './polyfill' : './lib/rangify')

// 1. Types
// 1.1. Range class/helper
should(Range).be.a.Class
should(range).be.a.Function

// 1.2. Iterator
iter = range('1~3')
should(iter).be.a.Object
should(iter.next).be.a.Function

// 1.3. Properties
r = new Range('1~3')
should(r.range).be.a.Array
should(r.step).be.a.Number

// 2. Ranges
let test_range = (r, expected) => {
	should.deepEqual(r.range, expected)
}
let test_ranges = (ranges, expected) => {
	ranges.forEach((r) => test_range(r, expected))
}

// 2.1. Positive
test_ranges([
	new Range(1, 10),
	new Range('1~10'),
	new Range([[1, 10]]),
], [[1, 10]])

test_range(new Range([1, 10]), [[1, 1], [10, 10]])

// 2.2. Negative
test_ranges([
	new Range(-100, -90),
	new Range('-100~-90'),
], [[-100, -90]])

test_ranges([
	new Range(-3, 3),
	new Range('-3~3'),
], [[-3, 3]])

// 2.3. Infinity
test_ranges([
	new Range(-Infinity, 10),
	new Range('~10'),
], [[-Infinity, 10]])

test_ranges([
	new Range(-11, Infinity),
	new Range('-11~'),
], [[-11, Infinity]])

// 2.4. Multiple
test_range(new Range('1, 4~6, 10'), [[1, 1], [4, 6], [10, 10]])
test_range(new Range('-10~5, 10~'), [[-10, 5], [10, Infinity]])

// 3. Iterator
let is_next = (iter, value, done = false) => {
	let next = iter.next()
	should(next).be.a.Object
	should(next.value).equal(value)
	should(next.done).equal(done)
}
let is_done = (iter, done = true) => is_next(iter, undefined, done)
let equal_values = (iter, values) => {
	for (let i of iter) {
		should(i).equal(values.shift())
	}
}

let make_range = (start, stop, inclusive = false) => rangeArray(start, stop + !!inclusive)

// 3.1. Iterator (through for..of)
j = 1
for (let i of new Range('1~10')) {
	should(i).equal(j)
	++j
}
should(j).equal(10)

j = 1
for (let i of range('1~10')) {
	should(i).equal(j)
	++j
}
should(j).equal(10)

// 3.1. Positive
iter = range('1~10')
for (let i = 1; i < 10; ++i) {
	is_next(iter, i)
}
is_done(iter)

// NOTE: Verify make_range's output
iter = range('1~10')
equal_values(iter, make_range(1, 10))

// 3.3. Negative
iter = range('-3~3')
equal_values(iter, make_range(-3, 3))

iter = range('-100~-90')
equal_values(iter, make_range(-100, -90))

// 3.4. Infinity
iter = range('0~')

// TODO(mauvm): Figure out way to properly test this.
for (let i = 0; i < 10000; ++i) {
	should(iter.next().value).equal(i)
}

// 3.5. Multiple
iter = range('-10~-5, 2~3, 4~6, 10~20')
equal_values(
	iter,
	make_range(-10, -5, true)
		.concat(make_range(2, 6, true))
		.concat(make_range(10, 20))
)

// 3.6. Steps

// Done
console.log('Great success!')
