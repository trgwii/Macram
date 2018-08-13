'use strict';

const isCall = require('../../utils/isCall');
const isFn = require('../../utils/isFn');

const stringifyArgs = args =>
	// eslint-disable-next-line no-use-before-define
	args.map(stringify).join(', ');

const stringify = tree => {

	if (isFn(tree)) {
		return tree.name;
	}

	if (isCall(tree)) {
		return stringify(tree.expr) +
			'(' +
			stringifyArgs(tree.args) +
			')';
	}

	if (Array.isArray(tree)) {
		return '[ ' + stringifyArgs(tree) + ' ]';
	}

	if (typeof tree === 'object') {
		return '{ ' +
			Object.entries(tree).map(([ name, value ]) =>
				JSON.stringify(name) + ': ' + stringify(value)) +
			' }';
	}

	return tree;
};

module.exports = stringify;
