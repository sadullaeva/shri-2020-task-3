const getBlockName = require('../../utils/getBlockName');

class GridValidator {
  constructor(jsonAst, state) {
    this.children = jsonAst.children;
    this.location = jsonAst.loc;

    const { content, mods } = this.children.reduce((acc, child) => {
      if (child.key.value === 'content') acc.content = child;
      if (child.key.value === 'mods') acc.mods = child;
      return acc;
    }, { content: undefined, mods: undefined });
    this.content = content;
    this.mods = mods;

    this.colNum = this.mods.value.children.find(child => child.key.value === 'm-columns');
    this.colNum = this.colNum && this.colNum.value.value;

    this.marketingColNum = 0;

    this.state = state;
  }

  validate() {
    const _this = this;
    if (this.content) {
      this.content.value.children.forEach(function (child) {
        _this.resolver(child);
      });
    }
    if (this.marketingColNum) {
      this.state.recheck.push(() => {
        this.checkPartOfMarketingBlocks(null, true);
      });
    }
  }

  resolver = (obj) => {
    const { mCol, block } = obj.children.reduce((acc, child) => {
      if (child.key.value === 'elemMods') {
        const mods = child.value.children;
        const mColMod = mods.find(mod => mod.key.value === 'm-col');
        acc.mCol = mColMod && mColMod.value.value;
      }
      if (child.key.value === 'content') {
        acc.block = child.value.children[0];
      }
      return acc;
    }, { mCol: undefined, block: undefined });

    const blockName = block.type === 'Object' ? getBlockName(block) : block.value.value;
    switch (blockName) {
      case 'commercial':
      case 'offer':
        this.checkPartOfMarketingBlocks(mCol, false);
        break;
      default:
        break;
    }
  };

  checkPartOfMarketingBlocks = (mCol, isRecheck) => {
    if (!isRecheck) {
      if (!mCol) return;
      this.marketingColNum += parseInt(mCol);
      return;
    }

    if (!this.colNum) return;

    if (isRecheck) {
      const colNum = parseInt(this.colNum);
      const allowedColNum = colNum % 2 === 0 ? colNum / 2 : (colNum - 1) / 2;
      if (this.marketingColNum > allowedColNum) {
        const { start, end } = this.location;
        const error = {
          code: 'GRID.TOO_MUCH_MARKETING_BLOCKS',
          error: 'Маркетинговые блоки (offer, commercial) должны занимать не больше половины от всех колонок блока grid',
          location: {
            start: { column: start.column, line: start.line },
            end: { column: end.column, line: end.line }
          }
        };
        this.state.errors.push(error);
      }
    }
  };
}

module.exports = GridValidator;
