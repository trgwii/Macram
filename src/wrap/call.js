'use strict';

const assignFunctionProps = require('../utils/assignFunctionProps');
const Call = require('../utils/Call');

const wrapCall = (store, fn, ref, args) => {
	const wrapped = assignFunctionProps(fn, (...args) => {
		const result = fn(...args);
		return typeof result === 'function'
			? wrapCall(store, result, wrapped, args)
			: result;
	});
	store.set(wrapped, Call(ref, args));
	return wrapped;
};

module.exports = wrapCall;
