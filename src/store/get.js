'use strict';

const Fn = require('../utils/Fn');

const get = (store, fn) =>
	store.get(fn) ||
		(fn && fn.name && fn.name.length > 0
			? Fn(fn.name)
			: fn);

module.exports = get;
