const test = require('tape')
const MockCrock = require('../test/MockCrock')
const helpers = require('../test/helpers')
const laws = require('../test/laws')

const bindFunc = helpers.bindFunc

const equals = require('../core/equals')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')
const isString = require('../core/isString')

const Maybe = require('../core/Maybe')
const First = require('.')

const fl = require('../core/flNames')

const constant = x => () => x

const extract =
  m => m.option('empty')

test('First', t => {
  t.ok(isFunction(First), 'is a function')
  t.ok(isObject(First(0)), 'returns an object')

  t.equals(First(0).constructor, First, 'provides TypeRep on constructor')

  t.ok(isFunction(First.empty), 'provides an empty function')
  t.ok(isFunction(First.type), 'provides a type function')
  t.ok(isString(First['@@type']), 'provides a @@type string')

  const err = /First: Requires one argument/
  t.throws(First, err, 'throws when passed nothing')

  t.end()
})

test('First fantasy-land api', t => {
  const m = First(10)

  t.ok(isFunction(First[fl.empty]), 'provides empty function on constructor')

  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')

  t.end()
})

test('First @@implements', t => {
  const f = First['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals')
  t.end()
})

test('First inspect', t => {
  const val = First(0)
  const just = First(Maybe.Just(1))
  const nothing = First(Maybe.Nothing())

  t.ok(isFunction(val.inspect), 'provides an inspect function')
  t.equal(val.inspect, val.toString, 'toString is the same function as inspect')

  t.equal(val.inspect(), 'First( Just 0 )', 'returns inspect string for value construction')
  t.equal(just.inspect(), 'First( Just 1 )', 'returns inspect string for value construction')
  t.equal(nothing.inspect(), 'First( Nothing )', 'returns inspect string for value construction')

  t.end()
})

test('First valueOf', t => {
  t.ok(isFunction(First(0).valueOf), 'is a function')

  const val = First(1).valueOf()
  const just = First(Maybe.Just(2)).valueOf()
  const nothing = First(Maybe.Nothing()).valueOf()

  t.ok(isSameType(Maybe, val), 'returns a Maybe when constructed with a value')
  t.ok(isSameType(Maybe, just), 'returns a Maybe when constructed with a Just')
  t.ok(isSameType(Maybe, nothing), 'returns a Maybe when constructed with a nothing')

  t.equal(extract(val), 1, 'returns a Just when constructed with a value')
  t.equal(extract(just), 2, 'returns a Just when constructed with a Just')
  t.equal(extract(nothing), 'empty', 'returns a Nothing when constructed with a Nothing')

  t.end()
})

test('First type', t => {
  const m = First(0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(First.type, m.type, 'is the same function as the static type')
  t.equal(m.type(), 'First', 'reports First')

  t.end()
})

test('First @@type', t => {
  const m = First(0)

  t.equal(First['@@type'], m['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/First@2', 'reports crocks/First@2')

  t.end()
})

test('First option', t => {
  const val = First('val')
  const just = First('just')
  const nothing = First('nothing')

  t.equal(val.option('nothing'), 'val', 'extracts the underlying Just value')
  t.equal(just.option('nothing'), 'just', 'extracts the underlying Just value')
  t.equal(nothing.option('nothing'), 'nothing', 'returns the provided value with underlying Nothing')

  t.end()
})

test('First concat errors', t => {
  const a = First('a')

  const notFirst = { type: constant('First...Not') }

  const cat = bindFunc(a.concat)

  const err = /First.concat: First required/
  t.throws(cat(undefined), err, 'throws with undefined')
  t.throws(cat(null), err, 'throws with null')
  t.throws(cat(0), err, 'throws with falsey number')
  t.throws(cat(1), err, 'throws with truthy number')
  t.throws(cat(''), err, 'throws with falsey string')
  t.throws(cat('string'), err, 'throws with truthy string')
  t.throws(cat(false), err, 'throws with false')
  t.throws(cat(true), err, 'throws with true')
  t.throws(cat([]), err, 'throws with an array')
  t.throws(cat({}), err, 'throws with an object')
  t.throws(cat(notFirst), err, 'throws when passed non-First')

  t.end()
})

test('First concat fantasy-land errors', t => {
  const a = First('a')

  const notFirst = { type: constant('First...Not') }

  const cat = bindFunc(a[fl.concat])

  const err = /First.fantasy-land\/concat: First required/
  t.throws(cat(undefined), err, 'throws with undefined')
  t.throws(cat(null), err, 'throws with null')
  t.throws(cat(0), err, 'throws with falsey number')
  t.throws(cat(1), err, 'throws with truthy number')
  t.throws(cat(''), err, 'throws with falsey string')
  t.throws(cat('string'), err, 'throws with truthy string')
  t.throws(cat(false), err, 'throws with false')
  t.throws(cat(true), err, 'throws with true')
  t.throws(cat([]), err, 'throws with an array')
  t.throws(cat({}), err, 'throws with an object')
  t.throws(cat(notFirst), err, 'throws when passed non-First')

  t.end()
})

test('First concat functionality', t => {
  const a = First('a')
  const b = First('b')

  t.equal(extract(a.concat(b)), 'a', 'returns the first value concatted')

  t.end()
})

test('First equals properties (Setoid)', t => {
  const a = First(3)
  const b = First(3)
  const c = First(3)
  const d = First(5)

  const equals = laws.Setoid('equals')

  t.ok(isFunction(First({}).equals), 'provides an equals function')

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('First fantasy-land equals properties (Setoid)', t => {
  const a = First(3)
  const b = First(3)
  const c = First(3)
  const d = First(5)

  const equals = laws.Setoid(fl.equals)

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('First equals functionality', t => {
  const a = First(3)
  const b = First(3)
  const c = First(5)

  const value = {}
  const nonFirst = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Firsts are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Firsts are equal')
  t.equal(a.equals(nonFirst), false, 'returns false when passed a non-First')
  t.equal(c.equals(value), false, 'returns false when passed a simple value')

  t.end()
})

test('First concat properties (Semigroup)', t => {
  const a = First(0)
  const b = First(1)
  const c = First('')

  const concat = laws.Semigroup('concat')

  t.ok(isFunction(a.concat), 'provides a concat function')

  t.ok(concat.associativity(equals, a, b, c), 'associativity')

  t.end()
})

test('First fantasy-land concat properties (Semigroup)', t => {
  const a = First(0)
  const b = First(1)
  const c = First('')

  const concat = laws.Semigroup(fl.concat)

  t.ok(concat.associativity(equals, a, b, c), 'associativity')

  t.end()
})

test('First empty functionality', t => {
  const x = First.empty()

  t.equal(x.type(), 'First', 'provides an First')
  t.equal(extract(x), 'empty', 'provides a true value')

  t.end()
})

test('First empty properties (Monoid)', t => {
  const m = First(3)

  const empty = laws.Monoid('empty', 'concat')

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.constructor.empty), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(equals, m), 'left identity')
  t.ok(empty.rightIdentity(equals, m), 'right identity')

  t.end()
})

test('First fantasy-land empty properties (Monoid)', t => {
  const m = First(3)

  const empty = laws.Monoid(fl.empty, fl.concat)

  t.ok(empty.leftIdentity(equals, m), 'left identity')
  t.ok(empty.rightIdentity(equals, m), 'right identity')

  t.end()
})
