'use strict';

const { placeholderSymbol } = require('./symbols');

const isPlaceholder = x =>
	x === placeholderSymbol;

module.exports = isPlaceholder;
