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

const optimizer = R.compose(
	R.when(
		R.equals({ name: 'reduce', args: [ { name: 'add', args: [] }, 0 ] }),
		x => ({ name: 'sum', args: [] })),
	R.when(
		x => x && x.name === 'identity' && x.args.length > 0,
		x => x.args[0]),
	R.when(
		x => x && x.name === 'compose' && x.args.length === 1,
		x => x.args[0]));

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
	myFunc
});

console.log(
	'Pre optimization:',
	stringify(myFunc));

console.log(
	'Post optimization:',
	stringify(optimize(myFunc)));


require('repl').start();
