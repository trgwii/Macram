'use strict';

// TODO: cleanup

const stream = require('stream');

const repl = require('repl');

const { optimize, optimizer } = require('../optimizers/ramda/basic');

const wrap = require('../wrap');
const parse = require('../parse');
const compile = require('../compile');
const stringify = require('../stringify/js');

const [ R, store ] = wrap('ramda');

const evaluate = (() => {
	const re = new repl.REPLServer({
		input: new stream.Readable({ read: () => {} }),
		output: new stream.Writable({ write: () => {} })
	});
	re.emit('exit');
	return re.eval;
})();

const replContext = repl.start({
	eval: (line, context, filename, callback) => {
		try {
			return evaluate(
				line,
				context,
				filename,
				(err, result) =>
					err
						? callback(err)
						: callback(null,
							stringify(
								parse(
									store,
									compile(
										replContext,
										optimize(
											optimizer,
											parse(
												store,
												result)))))));
		} catch (err) {
			return callback(err);
		}
	}
}).context;

Object.assign(replContext, R, {
	R,
	store,
	parse,
	compile,
	stringify
});
