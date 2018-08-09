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

const { createOptimize } = require('./optimizer');

const optimize = createOptimize(buildTree, fromTree);

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
