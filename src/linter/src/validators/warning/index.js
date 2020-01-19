const traversal = require('../../traversal');
const getBlockName = require('../../utils/getBlockName');
const sizes = require('../../const/sizes');

class WarningValidator {
  constructor(jsonAst, state) {
    this.children = jsonAst.children;
    this.location =  jsonAst.loc;
    this.content = this.children.find(child => child.key.value === 'content');

    this.state = state;

    this.sizeStandard = undefined;
    this.placeholder = undefined;
  }

  validate() {
    const _this = this;
    if (this.content) {
      this.content.value.children.forEach(function (child) {
        traversal(child, _this.resolver);
      });
    }
  }

  resolver = (obj) => {
    const block = getBlockName(obj);
    switch (block) {
      case 'text':
        this.checkSameTextSize(obj);
        break;
      case 'button':
        this.checkButtonSize(obj);
        this.checkButtonPlace(obj, false);
        break;
      case 'placeholder':
        this.placeholder = obj;
        this.checkPlaceholderSize(obj);
        break;
      default:
        break;
    }
  };

  checkSameTextSize = (obj) => {
    const { children = [] } = obj;
    const mods = children.find(function(child) {
      return child.key.value === 'mods';
    });
    let size = mods && mods.value.children.find(function(child) {
      return child.key.value === 'size';
    });
    size = size.value.value;

    if (!size) return;
    if (!this.sizeStandard) {
      this.sizeStandard = size;
      return;
    }
    if (size !== this.sizeStandard) {
      const { start, end } = this.location;
      const error = {
        code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        error: 'Тексты в блоке warning должны быть одного размера',
        location: {
          start: { column: start.column, line: start.line },
          end: { column: end.column, line: end.line }
        }
      };
      this.state.errors.push(error);
    }
  };

  checkButtonSize = (obj) => {
    if (!this.sizeStandard) {
      this.state.recheck.push(() => {
        this.checkButtonSize(obj);
      });
      return;
    }

    const { children = [] } = obj;
    const mods = children.find(function(child) {
      return child.key.value === 'mods';
    });
    let size = mods && mods.value.children.find(function(child) {
      return child.key.value === 'size';
    });
    size = size.value.value;

    if (!size) return;

    const index = sizes.indexOf(this.sizeStandard);
    if (index === -1 && index === sizes.length - 1) return;
    if (size !== sizes[index + 1]) {
      const { start, end } = obj.loc;
      const error = {
        code: 'WARNING.INVALID_BUTTON_SIZE',
        error: `Размер кнопки блока warning должен быть '${sizes[index + 1]}', что на 1 шаг больше эталонного размера текста '${sizes[index]}'`,
        location: {
          start: { column: start.column, line: start.line },
          end: { column: end.column, line: end.line }
        }
      };
      this.state.errors.push(error);
    }
  };

  checkButtonPlace = (obj, isRecheck) => {
    if (!isRecheck) {
      this.state.recheck.push(() => {
        this.checkButtonPlace(obj, true);
      });
      return;
    }

    if (!this.placeholder) return;

    if (isRecheck) {
      const { start : btnStart, end : btnEnd } = obj.loc;
      const { start : phrStart } = this.placeholder.loc;

      if ((btnEnd.line < phrStart.line) || (btnEnd.line === phrStart.line && btnEnd.column < phrStart.column)) {
        const error = {
          code: 'WARNING.INVALID_BUTTON_POSITION',
          error: 'Блок button в блоке warning не может находиться перед блоком placeholder на том же или более глубоком уровне вложенности',
          location: {
            start: { column: btnStart.column, line: btnStart.line },
            end: { column: btnEnd.column, line: btnEnd.line }
          }
        };
        this.state.errors.push(error);
      }
    }
  };

  checkPlaceholderSize = (obj) => {
    const { children = [] } = obj;
    const validSizes = ['s', 'm', 'l'];

    const mods = children.find(function(child) {
      return child.key.value === 'mods';
    });
    let size = mods && mods.value.children.find(function(child) {
      return child.key.value === 'size';
    });
    size = size && size.value.value;

    if (!size) return;

    if (!validSizes.includes(size)) {
      const { start, end } = obj.loc;
      const error = {
        code: 'WARNING.INVALID_PLACEHOLDER_SIZE',
        error: 'Недопустимые размеры для блока placeholder в блоке warning. Допустимые размеры: s, m, l.',
        location: {
          start: { column: start.column, line: start.line },
          end: { column: end.column, line: end.line }
        }
      };
      this.state.errors.push(error);
    }
  };
}

module.exports = WarningValidator;
