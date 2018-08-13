'use strict';

const wrapFn = require('./fn');
const wrap = require('./lib');

wrap.fn = wrapFn;

module.exports = wrap;
