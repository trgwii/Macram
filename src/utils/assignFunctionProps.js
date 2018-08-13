'use strict';

const assignFunctionProps = (original, target) =>
	Object.defineProperties(target, {
		length: {
			configurable: true,
			value: original.length
		},
		name: {
			configurable: true,
			value: original.name
		},
		toString: {
			configurable: true,
			value: original.toString.bind(original)
		}
	});

module.exports = assignFunctionProps;
