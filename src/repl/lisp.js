'use strict';

// TODO: cleanup

const repl = require('repl');
const sParse = require('s-expression');

const optimizer = require('../optimizers/ramda/basic');
const { optimize, replaceWithFn } = optimizer;
let opt = optimizer.optimizer;

const wrap = require('../wrap');
const parse = require('../parse');
const compile = require('../compile');
const stringify = require('../stringify/lisp');

const Call = require('../utils/Call');
const Fn = require('../utils/Fn');

const [ R, store ] = wrap('ramda');

const parseExpr = R.cond([
	[ x => !Number.isNaN(Number(x)),
		Number ],
	[ x => typeof x === 'string',
		Fn ],
	[ x => x instanceof String,
		String ],
	[ x => Array.isArray(x),
		x =>
			typeof x[0] === 'string'
				? Call(x[0], x.slice(1).map(parseExpr))
				: Call('call', x.map(R.ifElse(
					x => typeof x === 'string',
					x => Fn(x),
					parseExpr))) ],
	[ R.T,
		x => x ]
]);

const evaluator = (line, context, filename, callback) => {
	const expr = sParse(line);
	if (!Array.isArray(expr)) {
		if (expr.col === 1) {
			return callback(new repl.Recoverable());
		}
		return callback(expr);
	}
	const tree = parseExpr(expr);
	const optimized = optimize(opt, tree);
	const ran = compile(replContext, optimized);
	return callback(null, stringify(parse(store, ran)));
};

const replContext = repl.start({
	eval: evaluator
}).context;

Object.assign(replContext, R, {
	R,
	String,
	list: (...args) => args,
	define: (ref, fn) => {
		replContext[ref.name] = fn;
		opt = R.compose(
			opt,
			replaceWithFn(parse(store, fn), ref.name));
		return fn;
	}
});

// require('repl').start();
