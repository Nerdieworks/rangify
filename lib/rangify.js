import parser from 'tiny-range'
import extend from 'extend'

// Remove 32bit integer limit
parser.options = extend({}, parser.options, { min: -Infinity, max: Infinity })

export class Range {
	constructor (start = 1, stop = null, step = 1) {
		let range

		if (typeof start === 'string') {
			range = parser.parse(start)
			step  = (stop || step)
		} else if (Array.isArray(start)) {
			range = start
			step  = (stop || step)
		} else {
			if (stop === null) stop = Infinity
			range = [[start, stop]]
		}

		range = range.map((i) => Array.isArray(i) ? i : [i, i])

		this['_range'] = range
		this['_step']  = step
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
			while (i > curr[1]) {
				curr = range.shift()
				if ( ! curr) return
				if (i < curr[0]) i = curr[0] + (curr[0] - i) % step
			}
		}
	}
}

export default (...args) => new Range(...args)[Symbol.iterator]()
