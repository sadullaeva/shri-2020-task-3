const getBlockName = require('./utils/getBlockName');
const WarningValidator = require('./validators/warning/index');
const TextValidator = require('./validators/text/index');
const GridValidator = require('./validators/grid/index');

/**
 * Matches validator to block type
 * @param jsonAst is BEM block JSON that's represented as AST
 * @param state contains linting errors and common state
 */
function resolver(jsonAst, state) {
  const block = getBlockName(jsonAst);
  switch (block) {
    case 'warning':
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      break;
    case 'text':
      const textValidator = new TextValidator(jsonAst, state);
      textValidator.validate();
      break;
    case 'grid':
      const gridValidator = new GridValidator(jsonAst, state);
      gridValidator.validate();
      break;
    default:
      break;
  }
}

module.exports = resolver;
