'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _bind = Function.prototype.bind;

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _parser = require('tiny-range');

var _parser2 = _interopRequireWildcard(_parser);

var _extend = require('extend');

var _extend2 = _interopRequireWildcard(_extend);

// Remove 32bit integer limit
_parser2['default'].options = _extend2['default']({}, _parser2['default'].options, { min: -Infinity, max: Infinity });

var Range = (function () {
	function Range() {
		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}

		var start = arguments[0] === undefined ? 0 : arguments[0];

		_classCallCheck(this, Range);

		var range = undefined,
		    step = 1,
		    inclusive = false;

		if (typeof start === 'string') {
			range = _parser2['default'].parse(start);
		} else if (Array.isArray(start)) {
			range = start;
		} else {
			var _stop = args.shift();
			if (typeof _stop !== 'number') _stop = Infinity;
			range = [[start, _stop]];
		}
		if (typeof args[0] === 'number') step = args.shift();
		if (typeof args[0] === 'boolean') inclusive = args.shift();

		range = range.map(function (i) {
			return Array.isArray(i) ? i : [i, i];
		});

		this._isFinite = range[0][0] !== -Infinity && range[range.length - 1][1] !== Infinity;

		this._range = range;
		this._step = step;
		this.inclusive = inclusive;
	}

	_createClass(Range, [{
		key: 'range',
		get: function () {
			return this._range;
		}
	}, {
		key: 'step',
		get: function () {
			return this._step;
		}
	}, {
		key: 'isFinite',
		get: function () {
			return this._isFinite;
		}
	}, {
		key: Symbol.iterator,
		value: regeneratorRuntime.mark(function callee$1$0() {
			var range, step, curr, i;
			return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						range = this.range.slice(0);
						step = this.step;
						curr = range.shift();
						i = curr[0];

					case 4:
						context$2$0.next = 6;
						return i;

					case 6:
						i += step;

					case 7:
						if (!(i >= curr[1] + !!(range.length || this.inclusive))) {
							context$2$0.next = 14;
							break;
						}

						curr = range.shift();

						if (curr) {
							context$2$0.next = 11;
							break;
						}

						return context$2$0.abrupt('return');

					case 11:
						if (i < curr[0]) i = curr[0] + (curr[0] - i) % step;
						context$2$0.next = 7;
						break;

					case 14:
						context$2$0.next = 4;
						break;

					case 16:
					case 'end':
						return context$2$0.stop();
				}
			}, callee$1$0, this);
		})
	}]);

	return Range;
})();

exports.Range = Range;

exports['default'] = function () {
	for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		args[_key2] = arguments[_key2];
	}

	return new (_bind.apply(Range, [null].concat(args)))()[Symbol.iterator]();
};

// Using >= instead of > makes the range *exclusive*.
// Add one (int(true) === 1) to the maximum when it's
// not the last subrange or the range should be inclusive.

