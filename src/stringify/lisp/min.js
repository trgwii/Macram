'use strict';

const isCall = require('../../utils/isCall');
const isFn = require('../../utils/isFn');

const stringifyArgs = args =>
	// eslint-disable-next-line no-use-before-define
	args.map(stringify).join(' ');

const stringify = tree => {

	if (isFn(tree)) {
		return tree.name;
	}

	if (isCall(tree)) {
		return '(' +
			stringify(tree.expr) +
			' ' +
			stringifyArgs(tree.args) +
		')';
	}

	if (Array.isArray(tree)) {
		return '(list ' + stringifyArgs(tree) + ')';
	}

	if (typeof tree === 'object') {
		return '(fromPairs ' +
			Object.entries(tree).map(stringify) +
			')';
	}

	return tree;
};

module.exports = stringify;
