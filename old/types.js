'use strict';

const Logic = require('./logic');

const { createOptimize } = require('./optimizer');

const wrapped = Logic.wrap(require('ramda'));

const optimize = createOptimize(wrapped.buildTree, wrapped.fromTree);

const R = wrapped.lib;

const { buildTree } = wrapped;

const isType = R.useWith(R.call,
	[ R.equals, R.type ]);

const types = {
	add: R.cond([
		[
			R.compose(
				R.any(
					R.complement(
						isType('Number'))),
				R.prop('args')),
			R.always(
				{ error: 'Non-number passed' })
		],
		[
			R.compose(
				R.lt(2),
				R.unapply(R.length),
				R.prop('args')),
			R.always(
				{ error: 'Too many arguments passed' })
		],
		[
			R.T,
			R.compose(
				R.assoc(
					'args',
					R.__,
					{ return: 'Number' }),
				R.compose(
					R.repeat('Number'),
					R.subtract(2),
					R.length,
					R.prop('args')))
		]
	]),
	compose: R.reduceRight
};


console.log(wrapped.stringify(types.add));
console.log(wrapped.stringify(optimize(types.add)));
