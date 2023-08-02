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
        name: '顶层作用域if',
        disabled: true,
        input: `
let a = 1;
if(a>2){
  await console.log('if', a);
}else{
  await console.log('else', b);
}
a++;
if(a<2){
  console.log(a);
}
`,
        output: `
const _$ = _$$(true);
let a = _$$.r({
  v: 1
});
_$.if(() => a.v > 2, _$$.mnr(async () => {
  await console.log('if', a.v);
})).else(_$$.mnr(async () => {
  await console.log('else', b);
})).end(() => {
  a.v++;
  _$.if(() => a.v < 2, () => {
    console.log(a.v);
  }).end(() => {});
});
`
    },
    {
        name: 'elseif & else & end',
        disabled: true,
        input: `
let a = 1;
a++;

if(a>2){
  console.log(a);
}else if(a>3){
  console.log(a);
}else if(a>4){
  console.log(a);
}
if(a>3){
  console.log(a);
}else if(a>3){
  console.log(a);
}else{
  console.log(a);
}
if(a>4){
  console.log(a);
}else{
  console.log(a);
}
if(a>4){
  console.log(a);
}
`,
        output: `
const _$ = _$$(true);
let a = _$$.r({
  v: 1
});
a.v++;
_$.if(() => a.v > 2, () => {
  console.log(a.v);
}).elif(() => a.v > 3, () => {
  console.log(a.v);
}).elif(() => a.v > 4, () => {
  console.log(a.v);
}).end(() => {
  _$.if(() => a.v > 3, () => {
    console.log(a.v);
  }).elif(() => a.v > 3, () => {
    console.log(a.v);
  }).else(() => {
    console.log(a.v);
  }).end(() => {
    _$.if(() => a.v > 4, () => {
      console.log(a.v);
    }).else(() => {
      console.log(a.v);
    }).end(() => {
      _$.if(() => a.v > 4, () => {
        console.log(a.v);
      }).end(() => {});
    });
  });
});
`
    },
    {
        name: '多层嵌套',
        disabled: true,
        input: `
let a = 1;
a++;
if(a>2){
  console.log(a);
}else if(a>3){
  console.log(a)
  if(a>4){
    console.log(a)
  }else{
    console.log(a)
  }
  console.log(a)
}
      `,
        output: `
const _$ = _$$(true);
let a = _$$.r({
  v: 1
});
a.v++;
_$.if(() => a.v > 2, () => {
  console.log(a.v);
}).elif(() => a.v > 3, () => {
  console.log(a.v);
  return _$.if(() => a.v > 4, () => {
    console.log(a.v);
  }).else(() => {
    console.log(a.v);
  }).end(() => {
    console.log(a.v);
  });
}).end(() => {});
      `
    }, {
        name: 'function作用域+JSX',
        disabled: true,
        input: `
function fn(){
  let a = 1;
  if(a>2){
    return <div>{a+1}</div>
  }else if(a<1){
    a++;
    return <div>{a+2}</div>
  }
  return <div>{a+3}</div>
}
      `,
        output: `
function fn() {
  const _$ = _$$();
  let a = _$$.r({
    v: 1
  });
  return _$.if(() => a.v > 2, () => {
    return /*#__PURE__*/_$$.ce("div", null, () => a.v + 1);
  }).elif(() => a.v < 1, () => {
    a.v++;
    return /*#__PURE__*/_$$.ce("div", null, () => a.v + 2);
  }).end(() => {
    return /*#__PURE__*/_$$.ce("div", null, () => a.v + 3);
  });
}
      `
    },
    {
        name: 'if Return',
        disabled: true,
        input: `
const dom = ()=>{
  let str = '1';
  if(str === '1'){
    console.log(str)
  }
  console.log(str)
}
const dom2 = ()=>{
  let str = '1';
  if(str === '1'){
    console.log(str)
  }
  return <div>{str}</div>;
}`,
        output: `
const dom = () => {
  const _$ = _$$();
  let str = '1';
  return _$.if(() => str === '1', () => {
    console.log(str);
  }).end(() => {
    console.log(str);
  });
};
const dom2 = () => {
  const _$ = _$$();
  let str = '1';
  return _$.if(() => str === '1', () => {
    console.log(str);
  }).end(() => {
    return /*#__PURE__*/_$$.ce("div", null, str);
  });
};
    `
    }, {

        name: '多个if串行',
        disabled: true,
        input: `
let a = 1;
if(a>2){
  await console.log('if', a);
}else{
  await console.log('else', b);
}
a++;
if(a<2){
  await console.log(a);
}
b++;
await console.log(c);
`,
        output: `
const _$ = _$$(true);
let a = _$$.r({
  v: 1
});
_$.if(() => a.v > 2, _$$.mnr(async () => {
  await console.log('if', a.v);
})).else(_$$.mnr(async () => {
  await console.log('else', b);
})).end(_$$.mnr(async () => {
  a.v++;
  _$.if(() => a.v < 2, _$$.mnr(async () => {
    await console.log(a.v);
  })).end(_$$.mnr(async () => {
    b++;
    await console.log(c);
  }));
}));
      `
    }, {
        name: '组件内多个if串联 & mnr',
        disabled: false,
        input: `
async function fn() {
  let a = 1;
  if(a>2){
    await console.log('if', a);
    return 1;
  }else{
    await console.log('else', b);
  }
  a++;
  if(a<2){
    await console.log(a);
  }
  b++;
  await console.log(c);
}
`,
        output: `
async function fn() {
  const _$ = _$$();
  let a = _$$.r({
    v: 1
  });
  return _$.if(() => a.v > 2, async () => {
    await console.log('if', a.v);
    return 1;
  }).else(_$$.mnr(async () => {
    await console.log('else', b);
  })).end(_$$.mnr(async () => {
    a.v++;
    return _$.if(() => a.v < 2, _$$.mnr(async () => {
      await console.log(a.v);
    })).end(_$$.mnr(async () => {
      b++;
      await console.log(c);
    }));
  }));
}
  `
    }
] as ICodeMap[];