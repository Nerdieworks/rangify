import should from 'should'
import rangeArray from 'range'

let iter, r, j

// Load Rangify
let es5Mode = (process.argv.filter((flag) => flag === '--es5').length > 0)
let {default: range, Range} = require(es5Mode ? './polyfill' : './lib/rangify')

// 1. Types
let test_inclusive = (range, inclusive = true) => {
	should(range.inclusive).be.a.Boolean
	should(range.inclusive).equal(inclusive)
}

// 1.1. Range class/helper
should(Range).be.a.Class
should(range).be.a.Function

// 1.2. Iterator
iter = range('1~3')
should(iter).be.a.Object
should(iter.next).be.a.Function

// 1.3. Properties
r = new Range('1~3')
should(r.range).be.a.array
should(r.step).be.a.number

// 1.4. Inclusive and exclusive
test_inclusive(new Range(1, 3, true))
test_inclusive(new Range('1~3', true))
test_inclusive(new Range([[1, 3]], true))

test_inclusive(new Range(1, 3, false), false)
test_inclusive(new Range('1~3', false), false)

// Defaults
test_inclusive(new Range(1, 3), false)
test_inclusive(new Range('1~3'), false)

// With step
test_inclusive(new Range(1, 30, 3, true))
test_inclusive(new Range('1~30', 3, true))

test_inclusive(new Range(1, 30, 3), false)
test_inclusive(new Range('1~30', 3), false)

// 2. Ranges
let test_range = (range, expected) => {
	should.deepEqual(range.range, expected)
}
let test_ranges = (ranges, expected) => {
	ranges.forEach((r) => test_range(r, expected))
}
let test_finite = (range, expected = true) => {
	should(range.isFinite).equal(expected)
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

// 2.5. isFinite
test_finite(new Range('1, 4~6, 10'), true)
test_finite(new Range('-3, 5'), true)
test_finite(new Range('-10~5, 10~'), false)
test_finite(new Range('~10'), false)

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
	should(values.length).equal(0)
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

// 3.6. Inclusive
iter = range('3~6', true)
equal_values(
	iter,
	make_range(3, 6, true)
)
is_done(iter)

iter = range('-3~2, 10~20', true)
equal_values(
	iter,
	make_range(-3, 2, true)
		.concat(make_range(10, 20, true))
)
is_done(iter)

// 3.7. Steps
iter = range('1, 3~6, 8~11', 2, true) // inclusive
equal_values(
	iter,
	[1, 3, 5, 9, 11]
)
is_done(iter)

iter = range('1, 3~5, 8~9', 2) // exclusive
equal_values(
	iter,
	[1, 3, 5]
)
is_done(iter)

// Done
console.log('Great success!')
