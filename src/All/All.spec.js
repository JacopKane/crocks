const test = require('tape')
const MockCrock = require('../test/MockCrock')
const helpers = require('../test/helpers')
const laws = require('../test/laws')

const bindFunc = helpers.bindFunc

const equals = require('../core/equals')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')

const fl = require('../core/flNames')

const All = require('.')

const constant = x => () => x
const identity = x => x

test('All', t => {
  const m = bindFunc(All)

  t.ok(isFunction(All), 'is a function')
  t.ok(isObject(All(false)), 'returns an object')

  t.equals(All(true).constructor, All, 'provides TypeRep on constructor')

  t.ok(isFunction(All.empty), 'provides an empty function')
  t.ok(isFunction(All.type), 'provides a type function')
  t.ok(isString(All['@@type']), 'provides a @@type string')

  const err = /All: Non-function value required/
  t.throws(All, err, 'throws with nothing')
  t.throws(m(identity), err, 'throws with a function')

  t.doesNotThrow(m(undefined), 'allows undefined')
  t.doesNotThrow(m(null), 'allows null')
  t.doesNotThrow(m(0), 'allows a falsey number')
  t.doesNotThrow(m(1), 'allows a truthy number')
  t.doesNotThrow(m(''), 'allows a falsey string')
  t.doesNotThrow(m('string'), 'allows a truthy string')
  t.doesNotThrow(m(false), 'allows false')
  t.doesNotThrow(m(true), 'allows true')
  t.doesNotThrow(m([]), 'allows an array')
  t.doesNotThrow(m({}), 'allows an object')

  t.end()
})

test('All fantasy-land api', t => {
  const m = All(true)

  t.ok(isFunction(All[fl.empty]), 'provides empty function on constructor')

  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')

  t.end()
})

test('All @@implements', t => {
  const f = All['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals func')

  t.end()
})

test('All inspect', t => {
  const m = All(0)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'All false', 'returns inspect string')

  t.end()
})

test('All valueOf', t => {
  t.ok(isFunction(All(0).valueOf), 'is a function')

  t.equal(All(undefined).valueOf(), true, 'reports true for undefined')
  t.equal(All(null).valueOf(), true, 'reports true for null')
  t.equal(All(0).valueOf(), false, 'reports false for falsey number')
  t.equal(All(1).valueOf(), true, 'reports true for truthy number')
  t.equal(All('').valueOf(), false, 'reports false for falsey number')
  t.equal(All('string').valueOf(), true, 'reports true for truthy string')
  t.equal(All(false).valueOf(), false, 'reports false for false')
  t.equal(All(true).valueOf(), true, 'reports true for true')
  t.equal(All([]).valueOf(), true, 'reports true for an array')
  t.equal(All({}).valueOf(), true, 'reports true for an object')

  t.end()
})

test('All type', t => {
  const m = All(0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(All.type, m.type, 'static and instance versions are the same')
  t.equal(m.type(), 'All', 'reports All')

  t.end()
})

test('All @@type', t => {
  const m = All(0)

  t.equal(All['@@type'], m['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/All@2', 'reports crocks/All@2')

  t.end()
})

test('All equals properties (Setoid)', t => {
  const a = All(true)
  const b = All(true)
  const c = All(true)
  const d = All(false)

  const equals = laws.Setoid('equals')

  t.ok(isFunction(a.equals), 'provides an equals function')

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('All fantasy-land equals properties (Setoid)', t => {
  const a = All(true)
  const b = All(true)
  const c = All(true)

  const equals = laws.Setoid(fl.equals)

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry')
  t.ok(equals.transitivity(a, b, c), 'transitivity')

  t.end()
})

test('All equals functionality', t => {
  const a = All(true)
  const b = All(true)
  const c = All(false)

  const value = {}
  const nonAll = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Alls are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Alls are equal')
  t.equal(a.equals(nonAll), false, 'returns false when passed a non-All')
  t.equal(c.equals(value), false, 'returns false when passed a simple value')

  t.end()
})

test('All concat functionality', t => {
  const a = All(true)
  const b = All(false)

  const notAll = { type: constant('All...Not') }

  const cat = bindFunc(a.concat)

  const err = /All.concat: All required/
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
  t.throws(cat(notAll), err, 'throws when passed non-All')

  t.equal(a.concat(a).valueOf(), true, 'true to true reports true')
  t.equal(a.concat(b).valueOf(), false, 'true to false reports false')
  t.equal(b.concat(b).valueOf(), false, 'false to false reports false')

  t.end()
})

test('All concat fantasy-land errors', t => {
  const a = All(true)
  const notAll = { type: constant('All...Not') }

  const cat = bindFunc(a[fl.concat])

  const err = /All.fantasy-land\/concat: All required/
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
  t.throws(cat(notAll), err, 'throws when passed non-All')

  t.end()
})

test('All concat properties (Semigroup)', t => {
  const a = All(0)
  const b = All(true)
  const c = All('')

  const concat = laws.Semigroup('concat')

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.ok(concat.associativity(equals, a, b, c), 'associativity')

  t.end()
})

test('All fantasy-land concat properties (Semigroup)', t => {
  const a = All(7)
  const b = All(true)
  const c = All(34)

  const concat = laws.Semigroup(fl.concat)

  t.ok(concat.associativity(equals, a, b, c), 'associativity')

  t.end()
})

test('All empty functionality', t => {
  const x = All(0).empty()

  t.equal(x.type(), 'All', 'provides an All')
  t.equal(x.valueOf(), true, 'provides a true value')

  t.end()
})

test('All empty properties (Monoid)', t => {
  const m = All(false)

  const empty = laws.Monoid('empty', 'concat')

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.constructor.empty), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(equals, m), 'left identity')
  t.ok(empty.rightIdentity(equals, m), 'right identity')

  t.end()
})

test('All fantasy-land empty properties (Monoid)', t => {
  const m = All(false)

  const empty = laws.Monoid(fl.empty, fl.concat)

  t.ok(empty.leftIdentity(equals, m), 'left identity')
  t.ok(empty.rightIdentity(equals, m), 'right identity')

  t.end()
})
