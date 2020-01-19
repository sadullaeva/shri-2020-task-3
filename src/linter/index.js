const traversal = require('./src/traversal');
const resolver = require('./src/resolver');
const parse = require('json-to-ast');

export function lint(string) {
  if (typeof string !== 'string') return;
  const state = {
    h1: undefined,
    h2: undefined,
    errors: [],
    recheck: [],
  };

  try {
    const ast = parse(string);
    traversal(ast, resolver, state);
    state.recheck.forEach(function (func) {
      func();
    });
  } catch {
    throw new Error('Something went wrong');
  }

  return state.errors;
}
