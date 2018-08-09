'use strict';

// Random tests and bullshit in this file

const Logic = require('./logic');
const {
	buildTree,
	fromTree,
	lib: R,
	store,
	stringify
} = Logic.wrap(require('ramda'));

const deepMap = require('./deepMap');
const optimizer = require('./optimizer');

const { placeholder, isPlaceholder } = require('./symbols');

const {
	append,
	equals,
	flip,
	ifElse,
	nthArg,
	o,
	reduce,
	reduced
} = R;

const replacePlaceholder = x =>
	x && x['@@functional/placeholder']
		? placeholder
		: x;

const restorePlaceholder = x =>
	isPlaceholder(x)
		? { '@@functional/placeholder': true }
		: x;

const optimize = fn => {
	// fromTree(deepMap(optimizer, buildTree(fn)));
	const a = buildTree(fn);
	const b = deepMap(replacePlaceholder, a);
	const c = deepMap(optimizer, b);
	const d = deepMap(restorePlaceholder, c);
	const e = fromTree(d);
	return e;
};

const myReducer = reduce(
	ifElse(
		o(equals(2), nthArg(1)),
		o(reduced, flip(append)),
		flip(append)),
	[]);

const myFunc = R.compose(R.reduce(R.add, 0));

Object.assign(global, R, {
	buildTree,
	fromTree,
	R,
	store,
	stringify,
	myReducer,
	myFunc,
	optimize
});

console.log(
	'Pre:',
	stringify(myReducer));

console.log(
	'Post:',
	stringify(optimize(myReducer)));

console.log(
	'Pre:',
	stringify(myFunc));

console.log(
	'Post:',
	stringify(optimize(myFunc)));

console.log(
	'Pre:',
	stringify(R.add(R.__, 1)));

console.log(
	'Post:',
	stringify(optimize(R.add(R.__, 1))));

console.log(
	'Pre:',
	stringify(R.add(1, R.__)));

console.log(
	'Post:',
	stringify(optimize(R.add(1, R.__))));

console.log(
	'Pre:',
	stringify(R.compose(R.compose(R.identity, R.map(R.identity)), R.identity)));

console.log(
	'Post:',
	stringify(optimize(R.compose(R.compose(R.identity, R.map(R.identity)), R.identity))));

require('repl').start();
