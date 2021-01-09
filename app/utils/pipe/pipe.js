module.exports = function pipe(value, ...fns) {
  return fns.reduce((accum, fn) => fn(accum), value)
}
