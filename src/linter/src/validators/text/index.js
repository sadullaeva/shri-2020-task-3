class TextValidator {
  constructor(jsonAst, state) {
    this.children = jsonAst.children;
    this.location = jsonAst.loc;
    this.mods = this.children.find(child => child.key.value === 'mods');

    this.state = state;
  }

  validate() {
    const _this = this;
    if (this.mods) {
      this.mods.value.children.forEach(function (mod) {
        _this.resolver(mod);
      });
    }
  }

  resolver = (obj) => {
    const mod = obj.key.value;
    switch (mod) {
      case 'type':
        const type = obj.value.value;
        switch (type) {
          case 'h1':
            this.checkNumberOfH1();
            this.state.h1 = obj;
            break;
          case 'h2':
            this.checkPositionOfH2(obj, false);
            this.state.h2 = obj;
            break;
          case 'h3':
            this.checkPositionOfH3(obj, false);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  checkNumberOfH1 = () => {
    if (this.state.h1) {
      const { start, end } = this.location;
      const error = {
        code: 'TEXT.SEVERAL_H1',
        error: 'Заголовок первого уровня на странице должен быть единственным',
        location: {
          start: { column: start.column, line: start.line },
          end: { column: end.column, line: end.line }
        }
      };
      this.state.errors.push(error);
    }
  };

  checkPositionOfH2 = (obj, isRecheck) => {
    if (!isRecheck) {
      this.state.recheck.push(() => {
        this.checkPositionOfH2(obj, true);
      });
      return;
    }

    if (!this.state.h1) return;

    if (isRecheck) {
      const { start : h1Start } = this.state.h1.loc;
      const { start : h2Start, end : h2End } = this.location;

      if ((h2End.line < h1Start.line) || (h2End.line === h1Start.line && h2End.column < h1Start.column)) {
        const error = {
          code: 'TEXT.INVALID_H2_POSITION',
          error: 'Заголовок второго уровня не может находиться перед заголовком первого уровня на том же или более глубоком уровне вложенности',
          location: {
            start: { column: h2Start.column, line: h2Start.line },
            end: { column: h2End.column, line: h2End.line }
          }
        };
        this.state.errors.push(error);
      }
    }
  };

  checkPositionOfH3 = (obj, isRecheck) => {
    if (!isRecheck) {
      this.state.recheck.push(() => {
        this.checkPositionOfH3(obj, true);
      });
      return;
    }

    if (!this.state.h2) return;

    if (isRecheck) {
      const { start : h2Start } = this.state.h2.loc;
      const { start : h3Start, end : h3End } = this.location;

      if ((h3End.line < h2Start.line) || (h3End.line === h2Start.line && h3End.column < h2Start.column)) {
        const error = {
          code: 'TEXT.INVALID_H3_POSITION',
          error: 'Заголовок третьего уровня не может находиться перед заголовком второго уровня на том же или более глубоком уровне вложенности',
          location: {
            start: { column: h3Start.column, line: h3Start.line },
            end: { column: h3End.column, line: h3End.line }
          }
        };
        this.state.errors.push(error);
      }
    }
  };
}

module.exports = TextValidator;
