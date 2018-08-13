'use strict';

const create = require('../store/create');
const wrapFn = require('./fn');

const wrapLib = lib => {
	const store = create();
	const wrapped = {};
	const entries = Object.entries(
		typeof lib === 'string'
			// eslint-disable-next-line global-require
			? require(lib)
			: lib);
	for (const [ name, fn ] of entries) {
		wrapped[name] = typeof fn === 'function'
			? wrapFn(store, fn, name)
			: fn;
	}
	return [
		wrapped,
		store
	];
};

module.exports = wrapLib;
