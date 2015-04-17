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

var _merge = require('merge');

var _merge2 = _interopRequireWildcard(_merge);

// Remove 32bit integer limit
_parser2['default'].options = _merge2['default'](true, _parser2['default'].options, { min: -Infinity, max: Infinity });

var Range = (function () {
	function Range() {
		var start = arguments[0] === undefined ? 1 : arguments[0];
		var stop = arguments[1] === undefined ? null : arguments[1];
		var step = arguments[2] === undefined ? 1 : arguments[2];

		_classCallCheck(this, Range);

		var range = undefined;

		if (typeof start === 'string') {
			range = _parser2['default'].parse(start);
			step = stop || step;
		} else if (Array.isArray(start)) {
			range = start;
			step = stop || step;
		} else {
			if (stop === null) stop = Infinity;
			range = [[start, stop]];
		}

		range = range.map(function (i) {
			return Array.isArray(i) ? i : [i, i];
		});

		this._range = range;
		this._step = step;
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
						if (!(i > curr[1])) {
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
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return new (_bind.apply(Range, [null].concat(args)))()[Symbol.iterator]();
};

