# Project overview

Information about this project

## Folders

Information organized by folder name (under `./src`)

### compile

`(globals: Object, tree: Tree) -> Function`

A single function that compiles a parsed function (Turns a tree into a function)

### optimizers

Library-specific optimizers to rewrite a source tree

You probably want `./optimizers/ramda/basic`

#### ramda/basic

Since the upper-level files jus re-export the same stuff under a namespace, all logic comes from ramda/basic at the moment.

Needs splitting up and organizing of different optimizations, as well as extracting a general optimize function.

### parse

`(store: WeakMap, fn: Function) -> Tree`

Parses a function into a source tree using the provided store to look up nested function definitions.

### repl

Some repl experiments, these are for running (`node src/repl/someLang`), and aren't required by other files.

### store

Basic wrapper for the `Function -> PartialTree` WeakMap.

Need to abstract setting values here properly.

This serves as a lookup in order to fetch partial trees when constructing a full Tree based on a function.

### stringify

`(tree: Tree) -> String`

Stringifies a full Tree to a JS or Lisp string, no deps.

(Minified options available)

### utils

Some deep traversal algorithms used by optimize and others.

Constructors for `Call`, `Fn`, and predicates `isCall`, `isFn`, used throughout.

`assignFunctionProps`, to mimic a normal ramda function.

`placeholder` replacement since ramda-based optimizers can't into placeholders.

`nameFunction` used by one of the repls for nice output.

### wrap

exports wrap/lib as `wrap`, wrap/fn as `wrap.fn`.

Currently messy because of options.

#### wrap/lib

```type
({ name: Function }, { optimize: Boolean, dedupe: Boolean })
-> [ { name: WrappedFunction }, store ]
```

wraps a lib in a possibly:
optimizing + deduping,
definitely:
parseable + recompileable + optimizable + stringifyable lib of functions.

#### wrap/fn

```type
(store: WeakMap, deduped: Map, optimizer: Function, fn: Function, name: String)
-> WrappedFunction
```

Wraps a function in a wrapped function using the passed store that will:
store necessary info in the store when called (and when wrapped), and keep working like normal

#### wrap/call

Internal use, wraps the result of a call to keep info about what it was called with.

```type
(store: WeakMap, deduped: Map, optimize: Function, fn: Function, ref: Function, args: Array)
-> WrappedFunction
```

fn is the result of the call, ref is the function that was called.

## Types

### Call

```type
{
	call: Symbol('call'),
	expr: Call | Fn | Function,
	args: Array
}
```

Represents a function call, symbol used for `isCall`.

`expr` will be a `Function` in a `PartialTree`, `Call` or `Fn` otherwise

`args` may contain more `Call`'s or `Fn`'s when in full `Tree`'s.

### Fn

{
	fn: Symbol('fn'),
	name: String
}

Represents a function reference, symbol used for `isFn`.

### PartialTree

`Call` or `Fn`. Represents a single "twig" of a source tree.

### Tree

`Call` or `Fn`. Represents a full source tree.

### WrappedFunction

A function that stores relevant info in a store before executing the function it wraps.
