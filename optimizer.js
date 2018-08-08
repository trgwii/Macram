'use strict';

const R = require('ramda');

const fn = (name, ...args) => ({ name, args });

const whenEq = (tree, fn) =>
	R.when(R.equals(tree), fn);

const alwaysWhenEq = (tree, replacement) =>
	whenEq(tree, () => replacement);

const replaceWithFn = (tree, name, ...args) =>
	alwaysWhenEq(tree, fn(name, ...args));

const optimizer = R.compose(
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
		fn('reduce', fn('add'), 0 ),
		'sum'),
	replaceWithFn(
		fn('invoker', 0, 'toLowerCase'),
		'toLower'),
	replaceWithFn(
		fn('invoker', 0, 'toUpperCase'),
		'toUpper'),
	replaceWithFn(
		fn('uniqBy', fn('identity')),
		'uniq'),
	R.when(
		x => x && x.name === 'identity' && x.args.length > 0,
		x => x.args[0]),
	R.when(
		x => x && x.name === 'compose' && x.args.length === 1,
		x => x.args[0])
);

module.exports = optimizer;
