'use strict';


const Call = require('./src/utils/Call');
const Fn = require('./src/utils/Fn');
const wrap = require('./src/wrap');
const parse = require('./src/parse');
const compile = require('./src/compile');
const stringify = require('./src/stringify');

const [ R, store ] = wrap(require('ramda'));

console.log('store.get(add):', store.get(R.add));
console.log('store.get(add()):', store.get(R.add()));
console.log('parse(store, add()):', parse(store, R.add()));

Object.assign(require('repl').start().context, R, {
	Call,
	Fn,
	parse,
	compile,
	stringify,
	store,
	R
});
