const parse = require('json-to-ast');
const getBlockName = require('./getBlockName');

describe('getBlockName', () => {
  test('valid block', () => {
    const jsonAst = parse(`{ "block": "button" }`);
    const blockName = getBlockName(jsonAst);
    expect(blockName).toBe('button');
  });

  test('invalid block', () => {
    const jsonAst = parse(`{ "elem": "button" }`);
    const blockName = getBlockName(jsonAst);
    expect(blockName).toBeUndefined();
  });
});
