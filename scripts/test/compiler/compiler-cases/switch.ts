/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-01 01:15:31
 * @Description: Coding something
 */
import { ICodeMap } from '../util';
// import { parseAlins } from 'src/node-parser';

// input: 'import aa from "aa"; var a=1;export let b=a+1; a=2;var s = `${a}${a+1}`;var d=<div class={a+1} b={`2${a}1${a+1}`}>{a}{a+1}</div>',

export default [
    {
        name: 'switch 顶层作用域名',
        disabled: false,
        input: `
switch(data.a) {
  case 0: console.log(1);break;
  case 1: {console.log(2);break;}
  case 2: {console.log(3);}break;
}
console.log(4);
`,
        output: `
const _$ = _$$(true);
_$.switch(() => data.a, [{
  c: () => {
    console.log(1);
    return;
  },
  v: 0,
  b: true
}, {
  c: () => {
    console.log(2);
    return;
  },
  v: 1,
  b: true
}, {
  c: () => {
    {
      console.log(3);
    }
    return;
  },
  v: 2,
  b: true
}]).end(() => {
  console.log(4);
});
    `
    },
    {
        name: 'switch base',
        disabled: false,
        input: `
async function fn() {
  switch(data.a) {
    case 0: console.log(1);break;
    case 1: {console.log(1);break;}
    case 2: {console.log(1);}break;
    case 3: return <div>c1</div>;
    case 4: list.push(2);
    case 5: return <div>c3</div>;
  }
  return <div>end</div>;
}
`,
        output: `
async function fn() {
  const _$ = _$$();
  return _$.switch(() => data.a, [{
    c: () => {
      console.log(1);
      return;
    },
    v: 0,
    b: true
  }, {
    c: () => {
      console.log(1);
      return;
    },
    v: 1,
    b: true
  }, {
    c: () => {
      {
        console.log(1);
      }
      return;
    },
    v: 2,
    b: true
  }, {
    c: () => {
      return /*#__PURE__*/_$$.ce("div", null, "c1");
    },
    v: 3
  }, {
    c: () => {
      list.push(2);
    },
    v: 4
  }, {
    c: () => {
      return /*#__PURE__*/_$$.ce("div", null, "c3");
    },
    v: 5
  }]).end(() => {
    return /*#__PURE__*/_$$.ce("div", null, "end");
  });
}
    `
    },
    {

        name: 'switch default',
        disabled: false,
        input: `
async function fn() {
  switch(data.a) {
    case 0: console.log(1);break;
    default: return <div>c3</div>;
  }
  return <div>end</div>;
}
`,
        output: `
async function fn() {
  const _$ = _$$();
  return _$.switch(() => data.a, [{
    c: () => {
      console.log(1);
      return;
    },
    v: 0,
    b: true
  }, {
    c: () => {
      return /*#__PURE__*/_$$.ce("div", null, "c3");
    }
  }]).end(() => {
    return /*#__PURE__*/_$$.ce("div", null, "end");
  });
}
  `
    },
    {

        name: 'switch 多层',
        disabled: false,
        input: `
async function fn() {
  switch(data.a) {
    case 0: console.log(1);break;
    case 1: {
      switch(data.a) {
        case 0: console.log(1);break;
        case 1: {
          
        }; brea;
        default: return <div>c3</div>;
      }
      return <div>end</div>;
    }; break;
    default: return <div>c3</div>;
  }
  return <div>end</div>;
}
`,
        output: `
async function fn() {
  const _$ = _$$();
  return _$.switch(() => data.a, [{
    c: () => {
      console.log(1);
      return;
    },
    v: 0,
    b: true
  }, {
    c: () => {
      {
        return _$.switch(() => data.a, [{
          c: () => {
            console.log(1);
            return;
          },
          v: 0,
          b: true
        }, {
          c: () => {
            {}
            ;
            brea;
          },
          v: 1
        }, {
          c: () => {
            return /*#__PURE__*/_$$.ce("div", null, "c3");
          }
        }]).end(() => {
          return /*#__PURE__*/_$$.ce("div", null, "end");
        });
      }
      ;
      return;
    },
    v: 1,
    b: true
  }, {
    c: () => {
      return /*#__PURE__*/_$$.ce("div", null, "c3");
    }
  }]).end(() => {
    return /*#__PURE__*/_$$.ce("div", null, "end");
  });
}
`
    },
    {

        name: 'switch 串行',
        disabled: false,
        input: `
async function fn() {
  switch(data.a) {
    // case 0: console.log(1);break;
    case 1: {console.log(2);break;}
    default: return <div>c3</div>;
  }

  switch(data.a) {
    case 0: console.log(1);break;
    case 1: {console.log(2);break;}
    default: return <div>c3</div>;
  }
  return <div>end</div>;
}
`,
        output: `
async function fn() {
  const _$ = _$$();
  return _$.switch(() => data.a, [{
    c: () => {
      console.log(2);
      return;
    },
    v: 1,
    b: true
  }, {
    c: () => {
      return /*#__PURE__*/_$$.ce("div", null, "c3");
    }
  }]).end(() => {
    return _$.switch(() => data.a, [{
      c: () => {
        console.log(1);
        return;
      },
      v: 0,
      b: true
    }, {
      c: () => {
        console.log(2);
        return;
      },
      v: 1,
      b: true
    }, {
      c: () => {
        return /*#__PURE__*/_$$.ce("div", null, "c3");
      }
    }]).end(() => {
      return /*#__PURE__*/_$$.ce("div", null, "end");
    });
  });
}
      `
    }
] as ICodeMap[];
