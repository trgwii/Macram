'use strict';


const Macram = require('./src');

const [ R, store ] = Macram.wrap('ramda', {
	dedupe: true,
	optimize: false
});

const stringify = fn =>
	Macram.stringify.js.min(
		Macram.parse(store, fn));

const optimize = fn => {
	const { optimize, optimizer } = require('./src/optimizers/ramda/basic');
	return Macram.stringify.js.min(
		optimize(
			optimizer,
			Macram.parse(store, fn)));
};

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


Object.assign(require('repl').start().context, R, Macram, {
	R,
	store,
	str: stringify
});
