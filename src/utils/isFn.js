'use strict';

const { fnSymbol } = require('./symbols');

const isFn = fn =>
	fn && fn.fn === fnSymbol;

module.exports = isFn;
