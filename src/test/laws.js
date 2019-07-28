/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Paul Gray */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const compose = curry(require('../core/compose'))

const identity =
  x => x

module.exports = {
  Apply: (fn, mapFn) => ({
    composition: (equals, g, f, v) => equals(
      g[mapFn](compose)[fn](f)[fn](v),
      g[fn](f[fn](v))
    )
  }),
  Chain: (fn) => ({
    associativity: (equals, f, g, m) => equals(
      m[fn](f)[fn](g),
      m[fn](x => f(x)[fn](g))
    )
  }),
  Functor: fn => ({
    composition: (equals, f, g, m) => equals(
      m[fn](compose(f, g)),
      m[fn](g)[fn](f)
    ),
    identity: (equals, m) =>
      equals(m[fn](identity), m)
  }),
  Monoid: (fn, concatFn) => ({
    leftIdentity: (equals, m) =>
      equals(m.constructor[fn]()[concatFn](m), m),
    rightIdentity: (equals, m) =>
      equals(m[concatFn](m.constructor[fn]()), m)
  }),
  Semigroup: fn => ({
    associativity: (equals, m, n, o) => equals(
      m[fn](n)[fn](o),
      m[fn](n[fn](o))
    )
  }),
  Setoid: fn => ({
    reflexivity: m => m[fn](m),
    symmetry: (m, n) => m[fn](n) === n[fn](m),
    transitivity: (m, n, o) => m[fn](n) && n[fn](o)
      ? m[fn](o)
      : true
  })
}
