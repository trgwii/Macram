'use strict';

const isCall = require('../../utils/isCall');
const isFn = require('../../utils/isFn');

const min = require('./min');

const ind = indent =>
	' '.repeat(indent);

const stringifyArgs = (args, indent = 0) =>
	// eslint-disable-next-line no-use-before-define
	ind(indent) + args.map(stringify).join('\n' + ind(indent));

const stringify = (tree, indent = 0) => {

	if (isFn(tree)) {
		return tree.name;
	}

	if (isCall(tree)) {
		return '(' +
			stringify(tree.expr) +
			'\n' +
			stringifyArgs(tree.args, indent + 2) +
		')';
	}

	if (Array.isArray(tree)) {
		return ind(indent) +
			'(list\n' +
			stringifyArgs(tree, indent + 2) +
			')';
	}

	if (typeof tree === 'object') {
		return ind(indent) +
			'(fromPairs\n' +
			Object.entries(tree).map(x =>
				stringify(x, indent + 2)) +
			')';
	}

	return tree;
};

stringify.min = min;

module.exports = stringify;
