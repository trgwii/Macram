'use strict';

const readline = require('readline');
const parse = require('s-expression');
const deepMap = require('./deepMap');

const { createOptimize, addReplacement } = require('./optimizer');

const Logic = require('./logic');

const { Fn } = require('./symbols');

const {
	buildTree,
	fromTree,
	lib: R,
	store,
	stringify,
	wrapFn
} = Logic.wrap(require('ramda'));

const optimize = createOptimize(buildTree, fromTree);

const rl = readline.createInterface({
	input: process.stdin
});

R.list = (...args) => args;
R.define = (name, fn) => {
	addReplacement(buildTree(fn), name);
	R[name] = wrapFn(fn, name, []);
	return fn;
};

const parseExpr = R.cond([
	[ x => !Number.isNaN(Number(x)),
		Number ],
	[ x => x instanceof String,
		String ],
	[ x => Array.isArray(x),
		x =>
			typeof x[0] === 'string'
				? Fn(x[0], ...x.slice(1).map(R.ifElse(
					x => typeof x === 'string' && x in R,
					x => Fn(x),
					parseExpr)))
				: Fn('call', ...x.map(R.ifElse(
					x => typeof x === 'string' && x in R,
					x => Fn(x),
					parseExpr))) ],
	[ R.T,
		x => x ]
]);

rl.on('line', line => {
	const expr = parse(line);
	const tree = deepMap(parseExpr, expr);
	const compiled = fromTree(tree);
	const optimized = optimize(compiled);
	console.log(stringify(optimized));
});

Object.assign(global, R, {
	buildTree,
	fromTree,
	R,
	store,
	stringify
});

// require('repl').start();
