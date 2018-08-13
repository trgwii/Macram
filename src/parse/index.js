'use strict';

const get = require('../store/get');
const Call = require('../utils/Call');
const isCall = require('../utils/isCall');
const isFn = require('../utils/isFn');

const parse = (store, fn) => {
	const entry = get(store, fn) || fn;
	const reparse = x => parse(store, x);

	if (isFn(entry)) {
		return entry;
	}

	if (isCall(entry)) {
		return Call(
			reparse(entry.expr),
			entry.args.map(reparse));
	}

	if (Array.isArray(entry)) {
		return entry.map(reparse);
	}

	if (typeof entry === 'object') {
		const result = {};
		const entries = Object.entries(entry);
		for (const [ name, value ] of entries) {
			result[name] = reparse(value);
		}
		return result;
	}

	return entry;
};

module.exports = parse;
