'use strict';

// Unused stuff for later, may come in handy with optimizers?

const s ={
	fn: Symbol('fn'),
	call: Symbol('call')
};

const isCall = val => val[s.call];
const call = (name, ...args) => ({
	[s.call]: true,
	name,
	args
});
const isFn = val => val[s.fn];
const fn = name => ({
	[isFn]: true,
	name
});

const prefilled = {
	F: call('always', false),
	T: call('always', true),
	complement: call('lift', fn('not')),
	dec: call('add', -1),
	head: call('nth', 0),
	inc: call('add', 1),
	init: call('slice', 0, -1),
	join: call('invoker', 1, 'join'),
	last: call('nth', -1),
	partition: call('juxt', [ fn('filter'), fn('reject') ]),
	product: call('reduce', fn('multiply'), 1),
	split: call('invoker', 1, 'split'),
	sum: call('reduce', fn('add'), 0 ),
	toLower: call('invoker', 0, 'toLowerCase'),
	toUpper: call('invoker', 0, 'toUpperCase'),
	uniq: call('uniqBy', fn('identity'))
};
