'use strict';

const assignFunctionProps = require('../utils/assignFunctionProps');
const Fn = require('../utils/Fn');
const wrapCall = require('./call');

const wrapFn = (store, fn, name) => {
	const wrapped = assignFunctionProps(fn, (...args) => {
		const result = fn(...args);
		return typeof result === 'function'
			? wrapCall(store, result, wrapped, args)
			: result;
	});
	store.set(wrapped, Fn(name));
	return wrapped;
};

module.exports = wrapFn;
