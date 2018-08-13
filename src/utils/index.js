'use strict';

const assignFunctionProps = require('./assignFunctionProps');
const deepMap = require('./deepMap');
const Call = require('./Call');
const Fn = require('./Fn');
const isCall = require('./isCall');
const isFn = require('./isFn');
const isPlaceholder = require('./isPlaceholder');
const placeholder = require('./placeholder');
const symbols = require('./symbols');

module.exports = {
	assignFunctionProps,
	deepMap,
	Call,
	Fn,
	isCall,
	isFn,
	isPlaceholder,
	placeholder,
	symbols
};
