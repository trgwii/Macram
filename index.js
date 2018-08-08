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

const optimize = fn => {
	// fromTree(deepMap(optimizer, buildTree(fn)));
	const a = buildTree(fn);
	const b = deepMap(x =>
		x['@@functional/placeholder']
			? { __placeholder__: true }
			: x,
		a);
	const c = deepMap(optimizer, b);
	const d = deepMap(x =>
		x.__placeholder__
			? { '@@functional/placeholder': true }
			: x,
		c);
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
	'Pre optimization:',
	stringify(myFunc));

console.log(
	'Post optimization:',
	stringify(optimize(myFunc)));

console.log(
	'Pre optimization:',
	stringify(R.add(R.__, 1)));

console.log(
	'Post optimization:',
	stringify(optimize(R.add(R.__, 1))));

console.log(
	'Pre optimization:',
	stringify(R.add(1, R.__)));

console.log(
	'Post optimization:',
	stringify(optimize(R.add(1, R.__))));


require('repl').start();
