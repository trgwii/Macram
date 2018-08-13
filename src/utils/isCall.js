'use strict';

const { callSymbol } = require('./symbols');

const isCall = call =>
	call && call.call === callSymbol;

module.exports = isCall;
