const test = require('tape')
const sinon = require('sinon')

const MockCrock = require('../test/MockCrock')
const helpers = require('../test/helpers')
const laws = require('../test/laws')

const bindFunc = helpers.bindFunc

const equals = require('./equals')
const isFunction = require('./isFunction')
const isObject = require('./isObject')
const isString = require('./isString')
const unit = require('./_unit')

const fl = require('./flNames')

const identity = x => x

const applyTo =
  x => fn => fn(x)

const Unit = require('./Unit')

test('Unit', t => {
  const m = Unit(0)

  t.ok(isFunction(Unit), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.equals(Unit(false).constructor, Unit, 'provides TypeRep on constructor')

  t.ok(isFunction(Unit.empty), 'provides an empty function')
  t.ok(isFunction(Unit.type), 'provides a type function')
  t.ok(isString(Unit['@@type']), 'provides a @@type string')

  t.doesNotThrow(Unit, 'allows no parameters')

  t.end()
})

test('Unit fantasy-land api', t => {
  const m = Unit()

  t.ok(isFunction(Unit[fl.empty]), 'provides empty function on constructor')
  t.ok(isFunction(Unit[fl.of]), 'provides of function on constructor')

  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.of]), 'provides of method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')
  t.ok(isFunction(m[fl.map]), 'provides map method on instance')
  t.ok(isFunction(m[fl.chain]), 'provides chain method on instance')

  t.end()
})

test('Unit @@implements', t => {
  const f = Unit['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')

  t.end()
})

test('Unit inspect', t => {
  const m = Unit(0)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), '()', 'returns inspect string')

  t.end()
})

test('Unit type', t => {
  const m = Unit(0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(m.type, Unit.type, 'static and instance versions are the same')
  t.equal(m.type(), 'Unit', 'type returns Unit')

  t.end()
})

test('Unit @@type', t => {
  const m = Unit(0)

  t.equal(m['@@type'], Unit['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/Unit@2', 'type returns crocks/Unit@2')

  t.end()
})

test('Unit valueOf', t => {
  const x = 'some value'
  const m = Unit(x)

  t.ok(isFunction(m.valueOf), 'is a function')
  t.equal(m.valueOf(), undefined,'value always returns undefined' )

  t.end()
})

test('Unit equals functionality', t => {
  const a = Unit(0)
  const b = Unit(0)
  const c = Unit(1)

  const value = 0
  const nonUnit = MockCrock(value)

  t.equal(a.equals(c), true, 'returns true when 2 Nulls initial values are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Nulls initial values are equal')
  t.equal(a.equals(value), false, 'returns false when passed a simple value')
  t.equal(a.equals(nonUnit), false, 'returns false when passed a non-Unit')

  t.end()
})

test('Unit equals properties (Setoid)', t => {
  const a = Unit(0)
  const b = Unit(0)
  const c = Unit(0)
  const d = Unit(1)

  const equals = laws.Setoid('equals')

  t.ok(isFunction(Unit(0).equals), 'provides an equals function')

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Unit fantasy-land equals properties (Setoid)', t => {
  const a = Unit('great')
  const b = Unit('great')
  const c = Unit('great')
  const d = Unit(false)

  const equals = laws.Setoid(fl.equals)

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Unit concat errors', t => {
  const a = Unit(23)
  const notUnit = MockCrock()

  const cat = bindFunc(a.concat)

  const err = /Unit.concat: Unit required/
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
  t.throws(cat(notUnit), err, 'throws when passed non-Unit')

  t.end()
})

test('Unit concat fantasy-land errors', t => {
  const a = Unit(23)
  const notUnit = MockCrock()

  const cat = bindFunc(a[fl.concat])

  const err = /Unit.fantasy-land\/concat: Unit required/
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
  t.throws(cat(notUnit), err, 'throws when passed non-Unit')

  t.end()
})

test('Unit concat functionality', t => {
  const a = Unit(23)
  const b = Unit(null)

  t.equal(a.concat(b).valueOf(), undefined, 'reports null for 23')
  t.equal(b.concat(a).valueOf(), undefined, 'undefined for true')

  t.end()
})

test('Unit concat properties (Semigroup)', t => {
  const a = Unit(0)
  const b = Unit(true)
  const c = Unit('')

  const concat = laws.Semigroup('concat')

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.ok(concat.associativity(equals, a, b, c), 'associativity')

  t.end()
})

test('Unit fantasy-land concat properties (Semigroup)', t => {
  const a = Unit(0)
  const b = Unit(true)
  const c = Unit('')

  const concat = laws.Semigroup(fl.concat)

  t.ok(concat.associativity(equals, a, b, c), 'associativity')

  t.end()
})

test('Unit empty properties (Monoid)', t => {
  const m = Unit(3)

  const empty = laws.Monoid('empty', 'concat')

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.constructor.empty), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(equals, m), 'left identity')
  t.ok(empty.rightIdentity(equals, m), 'right identity')

  t.end()
})

test('Unit fantasy-land empty properties (Monoid)', t => {
  const m = Unit(3)

  const empty = laws.Monoid(fl.empty, fl.concat)

  t.ok(empty.leftIdentity(equals, m), 'left identity')
  t.ok(empty.rightIdentity(equals, m), 'right identity')

  t.end()
})

test('Unit empty functionality', t => {
  const x = Unit(0).empty()

  t.equal(x.type(), 'Unit', 'provides a Unit')
  t.equal(x.valueOf(), undefined, 'wraps an undefined value')

  t.end()
})

test('Unit map errors', t => {
  const map = bindFunc(Unit(0).map)

  const err = /Unit.map: Function required/
  t.throws(map(undefined), err, 'throws when passed undefined')
  t.throws(map(null), err, 'throws when passed null')
  t.throws(map(0), err, 'throws when passed falsey number')
  t.throws(map(1), err, 'throws when passed truthy number')
  t.throws(map(''), err, 'throws when passed falsey string')
  t.throws(map('string'), err, 'throws when passed truthy string')
  t.throws(map(false), err, 'throws when passed false')
  t.throws(map(true), err, 'throws when passed true')
  t.throws(map([]), err, 'throws when passed an array')
  t.throws(map({}), err, 'throws when passed an object')

  t.doesNotThrow(map(unit), 'does not throw when passed a function')

  t.end()
})

test('Unit map fantasy-land errors', t => {
  const map = bindFunc(Unit(0)[fl.map])

  const err = /Unit.fantasy-land\/map: Function required/
  t.throws(map(undefined), err, 'throws when passed undefined')
  t.throws(map(null), err, 'throws when passed null')
  t.throws(map(0), err, 'throws when passed falsey number')
  t.throws(map(1), err, 'throws when passed truthy number')
  t.throws(map(''), err, 'throws when passed falsey string')
  t.throws(map('string'), err, 'throws when passed truthy string')
  t.throws(map(false), err, 'throws when passed false')
  t.throws(map(true), err, 'throws when passed true')
  t.throws(map([]), err, 'throws when passed an array')
  t.throws(map({}), err, 'throws when passed an object')

  t.doesNotThrow(map(unit), 'does not throw when passed a function')

  t.end()
})

test('Unit map functionality', t => {
  const spy = sinon.spy(x => x + 2)
  const x = 42

  const m = Unit(x).map(spy)

  t.equal(m.type(), 'Unit', 'returns a Unit')
  t.notOk(spy.called, 'does not call mapping function')
  t.equal(m.valueOf(), undefined, 'returns undefined')

  t.end()
})

test('Unit map properties (Functor)', t => {
  const m = Unit(10)

  const f = x => x + 54
  const g = x => x * 4

  const map = laws.Functor('map')

  t.ok(isFunction(m.map), 'provides a map function')

  t.ok(map.identity(equals, m), 'identity')
  t.ok(map.composition(equals, f, g, m), 'composition')

  t.end()
})

test('Unit fantasy-land map properties (Functor)', t => {
  const m = Unit('nothing')

  const f = x => x + 54
  const g = x => x * 4

  const map = laws.Functor(fl.map)

  t.ok(map.identity(equals, m), 'identity')
  t.ok(map.composition(equals, f, g, m), 'composition')

  t.end()
})

test('Unit ap errors', t => {
  const m = MockCrock('joy')
  const ap = bindFunc(Unit(32).ap)

  const err = /Unit.ap: Unit required/
  t.throws(ap(undefined), err, 'throws when passed undefined')
  t.throws(ap(null), err, 'throws when passed null')
  t.throws(ap(0), err, 'throws when passed a falsey number')
  t.throws(ap(1), err, 'throws when passed a truthy number')
  t.throws(ap(''), err, 'throws when passed a falsey string')
  t.throws(ap('string'), err, 'throws when passed a truthy string')
  t.throws(ap(false), err, 'throws when passed false')
  t.throws(ap(true), err, 'throws when passed true')
  t.throws(ap([]), err, 'throws when passed an array')
  t.throws(ap({}), err, 'throws when passed an object')

  t.throws(ap(m), err, 'throws when container types differ')

  t.end()
})

test('Unit ap properties (Apply)', t => {
  const f = Unit(x => x + 10)
  const g = Unit(x => x * 10)
  const v = Unit(4)

  const ap = laws.Apply('ap', 'map')

  t.ok(isFunction(v.map), 'implements the Functor spec')
  t.ok(isFunction(v.ap), 'provides an ap function')

  t.ok(ap.composition(equals, g, f, v), 'composition')

  t.end()
})

test('Unit of', t => {
  t.equal(Unit.of, Unit(0).of, 'Unit.of is the same as the instance version')
  t.equal(Unit.of(0).type(), 'Unit', 'returns a Unit')
  t.equal(Unit.of(0).valueOf(), undefined, 'returns the default undefined value')

  t.end()
})

test('Unit of properties (Applicative)', t => {
  const m = Unit(identity)

  t.ok(isFunction(Unit(0).of), 'provides an of function')
  t.ok(isFunction(Unit(0).ap), 'implements the Apply spec')

  t.equal(m.ap(Unit(3)).valueOf(), undefined, 'identity')
  t.equal(m.ap(Unit.of(3)).valueOf(), Unit.of(identity(3)).valueOf(), 'homomorphism')

  const a = x => m.ap(Unit.of(x))
  const b = x => Unit.of(applyTo(x)).ap(m)

  t.equal(a(3).valueOf(), b(3).valueOf(), 'interchange')

  t.end()
})

test('Unit chain errors', t => {
  const chain = bindFunc(Unit(0).chain)

  const err = /Unit.chain: Function required/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws with null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  t.doesNotThrow(chain(unit), 'allows any function')

  t.end()
})

test('Unit chain fantasy-land errors', t => {
  const chain = bindFunc(Unit(0)[fl.chain])

  const err = /Unit.fantasy-land\/chain: Function required/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws with null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  t.doesNotThrow(chain(unit), 'allows any function')

  t.end()
})

test('Unit chain properties (Chain)', t => {
  const f = x => Unit(x * 2)
  const g = x => Unit(x + 60)
  const v = Unit(12)

  const chain = laws.Chain('chain')

  t.ok(isFunction(v.chain), 'provides a chain function')
  t.ok(isFunction(v.ap), 'implements the Apply spec')

  t.ok(chain.associativity(equals, f, g, v), 'associativity')

  t.end()
})

test('Unit fantasy-land chain properties (Chain)', t => {
  const f = x => Unit(x * 2)
  const g = x => Unit(x + 60)
  const v = Unit(12)

  const chain = laws.Chain(fl.chain)

  t.ok(chain.associativity(equals, f, g, v), 'associativity')

  t.end()
})

test('Unit chain properties (Monad)', t => {
  t.ok(isFunction(Unit(0).chain), 'implements the Chain spec')
  t.ok(isFunction(Unit(0).of), 'implements the Applicative spec')

  const f = x => Unit(x)

  t.equal(Unit.of(56).chain(f).valueOf(), f(56).valueOf(), 'left identity')

  t.equal(f(3).chain(Unit.of).valueOf(), f(3).valueOf(), 'right identity')

  t.end()
})
