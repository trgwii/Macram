'use strict';

// My deep object equality check! :D
/* eslint-disable no-nested-ternary */

const deepEquals = (a, b) =>
	Array.isArray(a)
		? Array.isArray(b)
			? a.length === b.length && a.every((x, i) => deepEquals(x, b[i]))
			: false
		: typeof a === 'object'
			? typeof b === 'object'
				? Object.keys(a).length === Object.keys(b).length &&
					Object.keys(a).every(key => deepEquals(a[key], b[key]))
				: false
			: a === b;

module.exports = deepEquals;
