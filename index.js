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

const optimize = fn => fromTree(deepMap(optimizer, buildTree(fn)));

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


require('repl').start();
