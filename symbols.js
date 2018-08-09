'use strict';

const fn = Symbol('fn');
const placeholder = Symbol('placeholder');

const isFn = x => x && x.fn === fn;
const isPlaceholder = x => x === placeholder;

const Fn = (name, ...args) => ({ fn, name, args });

module.exports = {
	fn,
	Fn,
	isFn,
	placeholder,
	isPlaceholder
};
