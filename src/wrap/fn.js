'use strict';

const assignFunctionProps = require('../utils/assignFunctionProps');
const Fn = require('../utils/Fn');
const wrapCall = require('./call');
const stringify = require('../stringify/lisp/min');

const wrapFn = (store, deduped, optimizer, fn, name) => {
	const wrapped = assignFunctionProps(fn, (...args) => {
		const result = fn(...args);
		return typeof result === 'function'
			? wrapCall(store, deduped, optimizer, result, wrapped, args)
			: result;
	});
	const expr = Fn(name);
	if (deduped) {
		const stringified = stringify(expr);
		const stored = deduped.get(stringified);
		if (stored) {
			return stored;
		}
		deduped.set(stringified, wrapped);
	}
	store.set(wrapped, expr);
	return wrapped;
};

module.exports = wrapFn;
