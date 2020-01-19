/**
 * Makes a recursive traversal of jsonAst object and calls resolver
 * function for BEM blocks
 * @param jsonAst is JSON that's represented as AST (Abstract Syntax Tree)
 * @param resolver is a function that matches validator to block type
 * @param state contains linting errors and common state
 */

function traversal(jsonAst, resolver, state) {
  const { type } = jsonAst;
  switch (type) {
    case 'Object':
      const isBlock = jsonAst.children.reduce(function(acc, child) {
        return acc && child.key.value !== 'elem';
      }, true);
      if (isBlock) {
        resolver(jsonAst, state);
      }
      jsonAst.children.forEach(function(child) {
        traversal(child, resolver, state);
      });
      break;
    case 'Property':
      if (jsonAst.key.value === 'content' || jsonAst.key.value === 'mix') {
        traversal(jsonAst.value, resolver, state);
      }
      break;
    case 'Array':
      jsonAst.children.forEach(function(child) {
        traversal(child, resolver, state);
      });
      break;
    case 'Identifier':
    case 'Literal':
    default:
      break;
  }
}

module.exports = traversal;
