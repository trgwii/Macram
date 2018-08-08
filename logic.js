'use strict';

// Ramda is only needed for R.toString
const R = require('ramda');

// Assign length, name, toString to target from source
const assignFunctionProps = (original, target) =>
	Object.defineProperties(target, {
		length: {
			configurable: true,
			value: original.length
		},
		name: {
			configurable: true,
			value: original.name
		},
		toString: {
			configurable: true,
			value: original.toString.bind(original)
		}
	});

// Wrap a single function into an argument-storing, stringifiable function
const wrapFn = (store, fn, name, initialArgs) => {
	const wrapped = assignFunctionProps(fn, (...args) => {
		const result = fn(...args);
		if (result instanceof Function) {
			return wrapFn(store, result, name, [ ...initialArgs, ...args ]);
		}
		return result;
	});
	store.set(wrapped, { name, args: initialArgs });
	return wrapped;
};

const buildTree = (store, fn) => {
	const entry = store.get(fn);
	return {
		name: entry.name,
		args: entry.args
			.map(x =>
				typeof x === 'function'
					? buildTree(store, x)
					: x)
	};
}

const fromTree = (lib, tree) =>
	lib[tree.name](...tree.args
		.map(arg =>
			typeof arg === 'object' &&
			typeof arg.name === 'string' &&
			Array.isArray(arg.args)
				? fromTree(lib, arg)
				: arg));

// Logic for stringifying a call expression
const stringifyCall = (store, name, args) =>
	args.length > 0
		? name + '(' + args
			.map(x =>
				typeof x === 'function'
					? stringify(store, x)
					: R.toString(x))
			.join(', ') +
		')'
		: name;

// Stringify a function
const stringify = (store, fn) => {
	// TODO: Should probably throw for missing entry
	const entry = store.get(fn) || {
		name: fn.name.length > 0
			? fn.name
			: R.toString(fn),
		args: []
	};
	return stringifyCall(store, entry.name, entry.args);
};

// Wrap an object of functions (Ramda, for instance)
const wrap = lib => {
	const store = new WeakMap();
	const result = {};
	const entries = Object.entries(lib);
	for (const [ name, fn ] of entries) {
		result[name] = wrapFn(store, fn, name, []);
	}
	return {
		buildTree: fn => buildTree(store, fn),
		fromTree: tree => fromTree(result, tree),
		lib: result,
		store,
		stringify: fn => stringify(store, fn),
		wrapFn: (fn, name, initialArgs) =>
			wrapFn(store, fn, name, initialArgs)
	};
};

module.exports = {
	buildTree,
	fromTree,
	stringify,
	wrap,
	wrapFn
};
