'use strict';

const R = require('ramda');

const deepMap = require('./deepMap');

const { Fn, isFn, isPlaceholder, placeholder } = require('./symbols');

const fn = Fn;

const whenEq = (tree, fn) =>
	R.when(R.equals(tree), fn);

const alwaysWhenEq = (tree, replacement) =>
	whenEq(tree, () => replacement);

const replaceWithFn = (tree, name, ...args) =>
	alwaysWhenEq(tree, fn(name, ...args));

const simpleReplacements = [
	replaceWithFn(
		fn('always', false),
		'F'),
	replaceWithFn(
		fn('always', true),
		'T'),
	replaceWithFn(
		fn('lift', fn('not')),
		'complement'),
	replaceWithFn(
		fn('add', -1),
		'dec'),
	replaceWithFn(
		fn('nth', 0),
		'head'),
	replaceWithFn(
		fn('add', 1),
		'inc'),
	replaceWithFn(
		fn('slice', 0, -1),
		'init'),
	replaceWithFn(
		fn('invoker', 1, 'join'),
		'join'),
	replaceWithFn(
		fn('nth', -1),
		'last'),
	replaceWithFn(
		fn('juxt', [ fn('filter'), fn('reject') ]),
		'partition'),
	replaceWithFn(
		fn('reduce', fn('multiply'), 1),
		'product'),
	replaceWithFn(
		fn('invoker', 1, 'split'),
		'split'),
	replaceWithFn(
		fn('reduce', fn('add'), 0),
		'sum'),
	replaceWithFn(
		fn('invoker', 0, 'toLowerCase'),
		'toLower'),
	replaceWithFn(
		fn('invoker', 0, 'toUpperCase'),
		'toUpper'),
	replaceWithFn(
		fn('uniqBy', fn('identity')),
		'uniq')
];

const nAryMathOp = (arity, name) =>
	R.when(
		x =>
			isFn(x) &&
			x.name === name &&
			x.args.length >= 2 &&
			x.args.every(x => typeof x === 'number'),
		x => R[name](...x.args));

const listMathOp = name =>
	R.when(
		x =>
			isFn(x) &&
			x.name === name &&
			x.args.length > 0 &&
			Array.isArray(x.args[0]) &&
			x.args[0].every(x => typeof x === 'number'),
		x => R[name](...x.args));

const unaryMathOp = name => nAryMathOp(1, name);
const binaryMathOp = name => nAryMathOp(2, name);

const mathConstants = [
	binaryMathOp('add'),
	binaryMathOp('subtract'),
	binaryMathOp('multiply'),
	binaryMathOp('divide'),
	unaryMathOp('dec'),
	unaryMathOp('inc'),
	binaryMathOp('mathMod'),
	binaryMathOp('modulo'),
	unaryMathOp('negate'),
	listMathOp('mean'),
	listMathOp('median'),
	listMathOp('product'),
	listMathOp('sum')
];

const binaryCommutative = name =>
	R.when(
		x =>
			isFn(x) &&
			x.name === name &&
			x.args.length >= 2 &&
			x.args.find(isPlaceholder),
		x => fn(x.name, ...x.args
			.filter(x =>
				x &&
				!isPlaceholder(x))));

const commutatives = [
	binaryCommutative('add'),
	binaryCommutative('product')
];

const optimizer = x => R.compose(
	...simpleReplacements,
	...mathConstants,
	...commutatives,
	R.when(
		x =>
			isFn(x) &&
			x.name === 'identity' &&
			x.args.length > 0,
		x => x.args[0]),
	R.when(
		x =>
			isFn(x) &&
			x.name === 'compose' &&
			x.args.length === 1,
		x => x.args[0]),
	R.when(
		x => isFn(x) &&
		x.name === 'compose' &&
		x.args.find(x =>
			isFn(x) &&
			x.name === 'identity'),
		x => fn(x.name, ...x.args.filter(x =>
			!(isFn(x) && x.name === 'identity')))),
	R.when(
		x =>
			isFn(x) &&
			x.args.length > 0 &&
			isPlaceholder(x.args[x.args.length - 1]),
		x => fn(x.name, ...x.args.slice(0, -1))),
	R.when(
		x =>
			isFn(x) &&
			x.name === 'call' &&
			x.args.length > 0,
		x => fn(x.args[0].name, ...x.args.slice(1)))
)(x);

const replacePlaceholder = x =>
	x && x['@@functional/placeholder']
		? placeholder
		: x;

const restorePlaceholder = x =>
	isPlaceholder(x)
		? { '@@functional/placeholder': true }
		: x;

const createOptimize = (buildTree, fromTree) => fn => {
	// fromTree(deepMap(optimizer, buildTree(fn)));
	const a = buildTree(fn);
	const b = deepMap(replacePlaceholder, a);
	const c = deepMap(optimizer, b);
	const d = deepMap(restorePlaceholder, c);
	const e = fromTree(d);
	return e;
};

module.exports = {
	optimizer,
	createOptimize,
	addReplacement: (tree, name, ...args) => {
		simpleReplacements.push(
			replaceWithFn(tree, name, ...args));
	}
};
