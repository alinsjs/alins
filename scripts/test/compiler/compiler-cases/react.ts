/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-01 01:15:31
 * @Description: Coding something
 */
// import { parseAlins } from 'src/node-parser';

export default [
    {
        name: 'base react',
        disabled: false,
        input: `
var a = 3;
var aa = 2;
var b = a + 1;
var c = b + 1;
a = 2;
aa(a, b, c);
`,
        output: `
var a = _$$.r({
  v: 3
});
var aa = 2;
var b = _$$.c(() => a.v + 1);
var c = _$$.c(() => b.v + 1);
a.v = 2;
aa(a.v, b.v, c.v);
`
    },
    {
        name: 'base react2',
        disabled: false,
        input: `
let a = 1;
let b = a + 1;
let x = 1;
a = 2;
let c = b + 1;
let y = x + 1;
let y2 = x + y + a + 1;
let e = c + b + 2;
`,
        output: `
let a = _$$.r({
  v: 1
});
let b = _$$.c(() => a.v + 1);
let x = 1;
a.v = 2;
let c = _$$.c(() => b.v + 1);
let y = x + 1;
let y2 = _$$.c(() => x + y + a.v + 1);
let e = _$$.c(() => c.v + b.v + 2);
`
    },
    {
        name: '后置变更触发更新依赖链',
        disabled: false,
        input: `
var a = 1;
var b = a + 1;
var c = b + 1;
console.log(a, b, c);
a = 2;
`,
        output: `
var a = _$$.r({
  v: 1
});
var b = _$$.c(() => a.v + 1);
var c = _$$.c(() => b.v + 1);
console.log(a.v, b.v, c.v);
a.v = 2;
      `
    },
    {
        name: '函数调用',
        disabled: false,
        input: `
var a = {a: {b:1}};
var b = aa(a);
a.a.b = 2;
`,
        output: `
var a = _$$.r({
  v: {
    a: {
      b: 1
    }
  }
});
var b = _$$.c(() => aa(a.v));
a.v.a.b = 2;
`
    },
    {
        name: 'react Object & assign',
        disabled: false,
        input: `
var a = {a: {b:1}};
var b = a.a.b+1;
var x = b + 1;
Object.assign(a, {a: {b:2}});
var c = Object.assign(a, {a: {b:2}}, c);
var d = Object.assign(a, {a: {b:2}}, c);
console.log(c.a, a.a, b, d.a, x);
c.a.b = 3;
a.a.b = 2;
`,
        output: `
var a = _$$.r({
  v: {
    a: {
      b: 1
    }
  }
});
var b = _$$.c(() => a.v.a.b + 1);
var x = _$$.c(() => b.v + 1);
Object.assign(a.v, {
  a: {
    b: 2
  }
});
var c = _$$.r({
  v: Object.assign(a.v, {
    a: {
      b: 2
    }
  }, c.v)
});
var d = Object.assign(a.v, {
  a: {
    b: 2
  }
}, c.v);
console.log(c.v.a, a.v.a, b.v, d.a, x.v);
c.v.a.b = 3;
a.v.a.b = 2;
`
    },
    {
        name: 'String template',
        disabled: false,
        input: [
            'import aa from "aa";',
            'var a=1;',
            'var x=1',
            'export let b=a+1;',
            'a=2;',
            'var s = `${a}${a+1}${x}${b}`;',
            'var d=<div class={a+1} x={x} b={`2${a}1${a+1}`}>{a}{a+1}</div>'
        ].join('\n'),
        output: `
import aa from "aa";
var a = _$$.r({
  v: 1
});
var x = 1;
let _$b = _$$.c(() => a.v + 1);
export let b = _$$.w(() => _$b.v, () => b = v, false).v;
a.v = 2;
var s = _$$.c(() => \`\${a.v}\${a.v + 1}\${x}\${_$b.v}\`);
var d = _$$.ce("div", {
  class: () => a.v + 1,
  x: x,
  b: () => \`2\${a.v}1\${a.v + 1}\`
}, a, () => a.v + 1);
`
    },
    {
        name: 'export alias',
        disabled: false,
        input: `
export let x = 1, n = 2;
let n2 = 3;
export let xx = x + 1;
console.log(x, xx, n2);
x = 2;
n2 = 4;
export default x;
`,
        output: `
let _$x = _$$.r({
  v: 1
});
export let x = _$$.w(() => _$x.v, () => x = v, false).v,
  n = 2;
let n2 = _$$.r({
  v: 3
});
let _$xx = _$$.c(() => _$x.v + 1);
export let xx = _$$.w(() => _$xx.v, () => xx = v, false).v;
console.log(_$x.v, _$xx.v, n2.v);
_$x.v = 2;
n2.v = 4;
export default _$x.v;
`,
    },
    {
        name: '@reactive & set:',
        disabled: false,
        input: `
import {a} from 'aa'; // @reactive
// @reactive(b)
import {b, c} from 'bb';
var aa = a + 1; set: v => {
};
var aaa = a + 1; set: c;
var aaaa = a + 1; set: (()=>{})();
var bb = b + 1;set:(v)=>{b.b = v};
var cc = c + 1;
var cc2 = a + 1;set:(v)=>{a = v};
export let xx = a+1; 
export let xxx = a; 
`,
        output: `
import { a } from 'aa'; // @reactive
// @reactive(b)
import { b, c } from 'bb';
var aa = _$$.c({
  get: () => a.v + 1,
  set: v => {}
});
var aaa = _$$.c({
  get: () => a.v + 1,
  set: c
});
var aaaa = _$$.c({
  get: () => a.v + 1,
  set: (() => {})()
});
var bb = _$$.c({
  get: () => b.v + 1,
  set: v => {
    b.v.b = v;
  }
});
var cc = c + 1;
var cc2 = _$$.c({
  get: () => a.v + 1,
  set: v => {
    a.v = v;
  }
});
let _$xx = _$$.c(() => a.v + 1);
export let xx = _$$.w(() => _$xx.v, () => xx = v, false).v;
let _$xxx = _$$.c(() => a.v);
export let xxx = _$$.w(() => _$xxx.v, () => xxx = v, false).v;
`
    },
    {
        name: '跨scope',
        disabled: false,
        input: `
let a = 1;
{
  a++;
}
a + 3;
let b = 1;
{
  {b + 2}
}
b ++;
        `,
        output: `
let a = _$$.r({
  v: 1
});
{
  a.v++;
}
a.v + 3;
let b = _$$.r({
  v: 1
});
{
  {
    b.v + 2;
  }
}
b.v++;
        `
    }
];