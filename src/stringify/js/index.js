'use strict';

const isCall = require('../../utils/isCall');
const isFn = require('../../utils/isFn');

const min = require('./min');

const ind = indent =>
	' '.repeat(indent);

const stringifyArgs = (args, indent) =>
	// eslint-disable-next-line no-use-before-define
	ind(indent) + args.map(stringify).join(',\n' + ind(indent));

const stringify = (tree, indent = 0) => {

	if (isFn(tree)) {
		return tree.name;
	}

	if (isCall(tree)) {
		return stringify(tree.expr) +
			'(\n' +
			stringifyArgs(tree.args, indent + 2) +
			')';
	}

	if (Array.isArray(tree)) {
		return ind(indent) +
			'[\n' +
			stringifyArgs(tree, indent + 2) +
			'\n' +
			ind(indent) +
			']';
	}

	if (typeof tree === 'object') {
		return ind(indent) +
			'{\n' +
			Object.entries(tree).map(([ name, value ]) =>
				JSON.stringify(name) +
				': ' +
				stringify(value, indent + 2)) +
			'\n' +
			ind(indent) +
			'}';
	}

	return tree;
};

stringify.min = min;

module.exports = stringify;
