'use strict';

const { fnSymbol } = require('./symbols');

const Fn = name =>
	typeof name === 'function'
		? name
		: {
			fn: fnSymbol,
			name
		};

module.exports = Fn;
