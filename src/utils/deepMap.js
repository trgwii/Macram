'use strict';

// My deep object mapper! :D
/* eslint-disable no-nested-ternary */

const deepMap = (fn, obj, key, parent) =>
	fn(
		Array.isArray(obj)
			? obj
				.map((x, i, arr) =>
					deepMap(
						fn,
						x,
						i,
						arr))
			: typeof obj === 'object'
				? Object.entries(obj)
					.reduce((acc, [ key, value ]) =>
						({
							...acc,
							[key]: deepMap(
								fn,
								value,
								key,
								obj)
						}), {})
				: obj,
		key,
		parent);

module.exports = deepMap;
