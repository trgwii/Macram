'use strict';

const assignFunctionProps = require('../utils/assignFunctionProps');
const deepEquals = require('../utils/deepEquals');
const Call = require('../utils/Call');
const parse = require('../parse');
const stringify = require('../stringify/lisp/min');
const compile = require('../compile');

const optimizeCall = (store, fn, optimizer) => {
	const tree = parse(store, fn);
	const optimizedTree = optimizer(tree);
	if (deepEquals(tree, optimizedTree)) {
		return [ fn, tree ];
	}
	const optimized = compile(optimizer.lib, optimizedTree);
	return [ optimized, optimizedTree ];
};

const wrapCall = (store, deduped, optimize, fn, ref, args) => {
	const wrapped = assignFunctionProps(fn, (...args) => {
		const result = fn(...args);
		return typeof result === 'function'
			? wrapCall(store, deduped, optimize, result, wrapped, args)
			: result;
	});
	const expr = Call(ref, args);
	store.set(wrapped, expr);
	if (deduped) {
		const stringified = stringify(expr);
		const stored = deduped.get(stringified);
		if (stored) {
			return stored;
		}
		if (optimize) {
			const [ optimized, optimizedTree ] =
				optimizeCall(store, wrapped, optimize);
			deduped.set(stringified, optimized);
			deduped.set(stringify(optimizedTree), optimized);
			store.set(optimized, optimizedTree);
			return optimized;
		}
		deduped.set(stringified, wrapped);
	}
	if (optimize) {
		const [ optimized, optimizedTree ] =
			optimizeCall(store, wrapped, optimize);
		store.set(optimized, optimizedTree);
		return optimized;
	}
	return wrapped;
};

module.exports = wrapCall;
