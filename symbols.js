'use strict';

const fn = Symbol('fn');
const placeholder = Symbol('placeholder');

const isFn = x => x && x.fn === fn;
const isPlaceholder = x => x === placeholder;

module.exports = {
	fn,
	isFn,
	placeholder,
	isPlaceholder
};
