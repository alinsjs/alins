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
        name: 'jsx before and after',
        disabled: false,
        input: `
function fn () {
  let a = 1;
  const dom1 = <div a={a} onclick={()=>a++} b={a+2}>{a+3}</div>
  a = 2;
  const dom12 = <div a={a} onclick={()=>{a++}} b={a+2}>{a+3}</div>
}
`,
        output: `
function fn() {
  let a = _$$.r({
    v: 1
  });
  const dom1 = /*#__PURE__*/_$$.ce("div", {
    a: a,
    onclick: () => a.v++,
    b: () => a.v + 2
  }, () => a.v + 3);
  a.v = 2;
  const dom12 = /*#__PURE__*/_$$.ce("div", {
    a: a,
    onclick: () => {
      a.v++;
    },
    b: () => a.v + 2
  }, () => a.v + 3);
}
`
    },
    {
        name: 'jsx',
        disabled: false,
        input:
        `
function fn () {
    let a = 1;
    const x = a + 1;
    a = 2;
    const c = a + x + 1;
    return <div a={a} b={\`{\${a}}\`} onclick={() => a + 1}>
        {c}
        {c + 1}
        {(() => {
            const a = c + 1;
            return a;
        })()}
        {1 + 1}
        {a + 11}
        {() => (a + 333)}
        {() => a + 333}
    </div>
}
`,
        output:
        `
function fn() {
  let a = _$$.r({
    v: 1
  });
  const x = _$$.c(() => a.v + 1);
  a.v = 2;
  const c = _$$.c(() => a.v + x.v + 1);
  return /*#__PURE__*/_$$.ce("div", {
    a: a,
    b: () => \`{\${a.v}}\`,
    onclick: () => a.v + 1
  }, c, () => c.v + 1, (() => {
    const a = _$$.c(() => c.v + 1);
    return a.v;
  })(), 1 + 1, () => a.v + 11, () => a.v + 333, () => a.v + 333);
}
`
    },
    {
        name: 'jsx',
        disabled: false,
        input: `
function fn () {
    let a = 1;
    let b = 1;
    b++;
    return <div a={a} b={b+2} onclick={() => a++}>
    </div>
}
`,
        output: `
function fn() {
  let a = _$$.r({
    v: 1
  });
  let b = _$$.r({
    v: 1
  });
  b.v++;
  return /*#__PURE__*/_$$.ce("div", {
    a: a,
    b: () => b.v + 2,
    onclick: () => a.v++
  });
}
`
    },
    {
        name: 'jsx在reactive赋值之前声明',
        disabled: false,
        input: `
let b = 3;
const dom = <div b={b+1}>{b+1}</div>;
b = 2;
`,
        output: `
let b = _$$.r({
  v: 3
});
const dom = /*#__PURE__*/_$$.ce("div", {
  b: () => b.v + 1
}, () => b.v + 1);
b.v = 2;
`
    },
    {
        name: '跨作用域的jsx',
        disabled: false,
        input: `
let a = 1;
{
  <div>{a+1}</div>
}
a++;
  `,
        output: `
let a = _$$.r({
  v: 1
});
{
  /*#__PURE__*/_$$.ce("div", null, () => a.v + 1);
}
a.v++;
`
    }
] as ICodeMap[];