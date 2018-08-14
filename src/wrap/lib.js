'use strict';

const create = require('../store/create');
const wrapFn = require('./fn');

const optimizers = {};
const deduped = {};

const loadOptimizer = (name, lib) => {
	const opt = require('../optimizers')[name].basic;
	const fn = optimizers[name] = x =>
		opt.optimize(opt.optimizer, x);
	fn.lib = lib;
	return fn;
};

const wrapLib = (lib, options) => {
	const store = create();
	const wrapped = {};
	if (options) {
		if (options.dedupe) {
			if (typeof lib !== 'string') {
				throw new TypeError(
					'Can\'t dedupe without knowing library name!');
			}
			deduped[lib] = new Map();
		}
		if (options.optimize) {
			if (typeof lib !== 'string') {
				throw new TypeError(
					'Can\'t optimize without knowing library name!');
			}
			loadOptimizer(lib, wrapped);
		}
	}
	const entries = Object.entries(
		typeof lib === 'string'
			// eslint-disable-next-line global-require
			? require(lib)
			: lib);
	for (const [ name, fn ] of entries) {
		wrapped[name] = typeof fn === 'function'
			? wrapFn(store, deduped[lib], optimizers[lib], fn, name)
			: fn;
	}
	return [
		wrapped,
		store
	];
};

module.exports = wrapLib;
