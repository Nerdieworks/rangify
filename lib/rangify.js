import parser from 'tiny-range'
import extend from 'extend'

// Remove 32bit integer limit
parser.options = extend({}, parser.options, { min: -Infinity, max: Infinity })

export class Range {
	constructor (start = 1, ...args) {
		let range, step = 1, inclusive = false

		if (typeof start === 'string') {
			range = parser.parse(start)
		} else if (Array.isArray(start)) {
			range = start
		} else {
			let stop = args.shift()
			if (typeof stop !== 'number') stop = Infinity
			range = [[start, stop]]
		}
		if (typeof args[0] === 'number') step = args.shift()
		if (typeof args[0] === 'boolean') inclusive = args.shift()

		range = range.map((i) => Array.isArray(i) ? i : [i, i])

		this['_range'] = range
		this['_step']  = step
		this.inclusive = inclusive
	}

	get range () { return this._range }
	get step  () { return this._step }

	*[Symbol.iterator] () {
		let range = this.range.slice(0)
		let step  = this.step
		let curr  = range.shift()
		let i     = curr[0]

		for (;;) {
			yield i
			i += step
			// Using >= instead of > makes the range *exclusive*.
			// Add one (int(true) === 1) to the maximum when it's
			// not the last subrange or the range should be inclusive.
			while (i >= curr[1] + !!(range.length || this.inclusive)) {
				curr = range.shift()
				if ( ! curr) return
				if (i < curr[0]) i = curr[0] + (curr[0] - i) % step
			}
		}
	}
}

export default (...args) => new Range(...args)[Symbol.iterator]()
