/**
 * Finds and returns the passed block name
 * @param jsonAst is BEM block object represented as AST
 * @returns block name
 */
module.exports = function (jsonAst) {
  const { children = [] } = jsonAst;
  let block;
  let index = 0;

  while (!block && index < children.length) {
    if (children[index].key.value === 'block') {
      block = children[index].value.value;
    }
    index = index + 1;
  }

  return block;
};
