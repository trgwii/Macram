'use strict';

const nameFunction = (name, fn) =>
	typeof fn === 'function'
		? Object.defineProperty(fn, 'name', {
			value: name
		})
		: fn;

module.exports = nameFunction;
