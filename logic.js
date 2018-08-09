'use strict';

// Ramda is only needed for R.toString
const R = require('ramda');
const isPlaceholder = require('ramda/src/internal/_isPlaceholder');

const { Fn, isFn } = require('./symbols');

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
		if (typeof result === 'function') {
			return wrapFn(store, result, name, [ ...initialArgs, ...args ]);
		}
		return result;
	});
	store.set(wrapped, Fn(name, ...initialArgs));
	return wrapped;
};

// Retrieve a call tree from store, defaults to a plain thingy
const getEntry = (store, fn) =>
	// TODO: Should probably throw for missing entry
	// Throwing means disallowing non-Ramda functions
	// Apparently just passing them through works fine :)
	store.get(fn) ||
		(fn && fn.name && fn.name.length > 0
			? Fn(fn.name)
			: fn);

// Build a call tree from a function
const buildTree = (store, fn) => {
	const entry = getEntry(store, fn);
	return isFn(entry)
		? Fn(entry.name, ...entry.args
			.map(x =>
				typeof x === 'function' && store.get(fn)
					? buildTree(store, x)
					: x))
		: entry;
};

// Reconstruct a function from a call tree
const fromTree = (lib, tree) =>
	isFn(tree)
		? lib[tree.name](...tree.args
			.map(arg =>
				isFn(arg)
					? fromTree(lib, arg)
					: arg))
		: tree;

// Logic for stringifying a call expression
const stringifyCall = (store, name, args) =>
	args.length > 0
		? name + '(' + args
			.map(x =>
				// eslint-disable-next-line no-nested-ternary
				typeof x === 'function'
					// eslint-disable-next-line no-use-before-define
					? stringify(store, x)
					: isPlaceholder(x)
						? '__'
						: R.toString(x))
			.join(', ') +
		')'
		: name;

// Stringify a function
const stringify = (store, fn) => {
	const entry = getEntry(store, fn);
	return stringifyCall(
		store,
		entry.name || R.toString(entry),
		isFn(entry)
			? entry.args
			: []);
};

// Wrap an object of functions (Ramda, for instance)
const wrap = lib => {
	const store = new WeakMap();
	const result = {};
	const entries = Object.entries(lib);
	for (const [ name, fn ] of entries) {
		result[name] = typeof fn === 'function'
			? wrapFn(store, fn, name, [])
			: fn;
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
