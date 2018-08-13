'use strict';

const isFn = require('../utils/isFn');
const isCall = require('../utils/isCall');

const compile = (globals, tree) => {

	const recompile = x =>
		compile(globals, x);

	if (isFn(tree)) {
		return globals[tree.name];
	}

	if (isCall(tree)) {
		return recompile(tree.expr)(...tree.args.map(recompile));
	}

	return tree;
};

module.exports = compile;
