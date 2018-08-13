'use strict';

const { callSymbol } = require('./symbols');
const Fn = require('./Fn');

const Call = (expr, args = []) =>
	({
		call: callSymbol,
		expr: typeof expr === 'string'
			? Fn(expr)
			: expr,
		args
	});

module.exports = Call;
