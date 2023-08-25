/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-01 01:15:31
 * @Description: Coding something
 */
import {ICodeMap} from '../util';
// import { parseAlins } from 'src/node-parser';
 
// input: 'import aa from "aa"; var a=1;export let b=a+1; a=2;var s = `${a}${a+1}`;var d=<div class={a+1} b={`2${a}1${a+1}`}>{a}{a+1}</div>',

export default [
    {
        name: 'mix1',
        disabled: false,
        input: `
let a = 0;

const dom = <div a={a+1} b={{
  a: a+2
}} onclick={()=>{
  a=1;
}}>
  {()=>a+1}
</div>
`,
        output: `
let a = _$$.r({
  v: 0
});
const dom = _$$.ce("div", {
  a: () => a.v + 1,
  b: () => ({
    a: a.v + 2
  }),
  onclick: () => {
    a.v = 1;
  }
}, () => a.v + 1);
    `
    },
    {
        name: 'mix2',
        disabled: false,
        input: `
let a = 0;

const dom = <div a={a+1} b={{
  a: a+2
}} onclick={()=>{
  a=1;
}}>
  {()=>a+1}
</div>
`,
        output: `
let a = _$$.r({
  v: 0
});
const dom = _$$.ce("div", {
  a: () => a.v + 1,
  b: () => ({
    a: a.v + 2
  }),
  onclick: () => {
    a.v = 1;
  }
}, () => a.v + 1);
    `
    },
    {
        name: 'mix3',
        disabled: false,
        input: `
let done = false;
<div a={!done}>
  <span>1</span>
  <button onclick={()=>{
    done = !done;
  }}></button>
</div>
`,
        output: `
let done = _$$.r({
  v: false
});
_$$.ce("div", {
  a: () => !done.v
}, _$$.ce("span", null, "1"), _$$.ce("button", {
  onclick: () => {
    done.v = !done.v;
  }
}));
    `
    },
    {
        name: 'mix4',
        disabled: false,
        input: `
function Aa(props, children){
  return <div>{props.b + 1} {props.a.b.c} </div> 
}
function Bb({a,b,c: C}, children){
  return <div>{a + 1} {b+1} {C+1} </div> 
}
`,
        output: `
function Aa(props, children) {
  return _$$.ce("div", null, () => props.b.v + 1, " ", () => props.a.v.b.c, " ");
}
function Bb({
  a,
  b,
  c: C
}, children) {
  return _$$.ce("div", null, () => a.v + 1, " ", () => b.v + 1, " ", () => C.v + 1, " ");
}
    `
    },
    {
        name: 'for component',
        disabled: false,
        input: `
let data = [1]
const d = <For data={data} item='item' index='index'>
  <span>{item+1}</span>
</For>
data.push(1);
`,
        output: `
let data = _$$.r({
  v: [1]
});
const d = data.v.map((item, index) => _$$.ce("", null, _$$.ce("span", null, () => item.v + 1)), true, "item", "index");
data.v.push(1);
    `
    },
    {
        name: 'if component',
        disabled: false,
        input: `
let i = 1
const d = <>
    <If data={i === 1}>
        <div>11</div>
    </If>
    <ElseIf data={i === 2}>
        <div>22</div>
    </ElseIf>
    <Else>
        <div>33</div>
    </Else>
</>
i = 2;
`,
        output: `
const _$ = _$$();
let i = _$$.r({
  v: 1
});
const d = _$$.ce("", null, _$.if(() => i.v === 1, () => _$$.ce("", null, _$$.ce("div", null, "11"))).elif(() => i.v === 2, () => _$$.ce("", null, _$$.ce("div", null, "22"))).else(() => _$$.ce("", null, _$$.ce("div", null, "33"))).end());
i.v = 2;
    `
    },
    {
        name: 'switch component',
        disabled: false,
        input: `
let v = 1;

<Switch data={v}>
  <Case data={1} break>11</Case>
  <Case data={2} break>22</Case>
  <Default>33</Default>
</Switch>

v = 2;
`,
        output: `
const _$ = _$$();
let v = _$$.r({
  v: 1
});
_$.switch(() => v.v, [{
  c: () => "11",
  v: 1,
  b: true
}, {
  c: () => "22",
  v: 2,
  b: true
}, {
  c: () => "33"
}]).end();
v.v = 2;
    `
    },
    {
        name: 'async component',
        disabled: false,
        input: `
document.body.appendChild(<Async data={aa()} name="data">
  <div onclick={()=>{
    data ++;
  }}>{data}</div>
  <div>{data+1}</div>
</Async>)
`,
        output: `
document.body.appendChild(_$$.ce(async () => {
  var data = _$$.r({
    v: await aa()
  });
  return _$$.ce("", null, _$$.ce("div", {
    onclick: () => {
      data.v++;
    }
  }, data), _$$.ce("div", null, () => data.v + 1));
}));
    `
    },
    {
        name: '赋值与替换',
        disabled: false,
        input: `
const a = 1;
a++;
const d1 = a[1];
const d2 = a.a.a();
const d22 = a.a.a;
const d3 = a.a();
const d4 = a;
const d5 = a().a;
`,
        output: `
const a = _$$.r({
  v: 1
});
a.v++;
const d0 = _$$.c(() => a.v + 1);
const d1 = a.v[1];
const d2 = _$$.c(() => a.v.a.a());
const d22 = a.v.a.a;
const d3 = _$$.c(() => a.v.a());
const d4 = a;
const d5 = _$$.c(() => a.v().a);
    `
    },
    {
        name: '函数热active传递',
        disabled: false,
        input: `
const a = 0;
const fn = () => a + 1;
function fn2 () {
    return a + 1;
}
fn();
const c = fn();
const c2 = fn2();
const c3 = c + 1;
const dom = <div a={fn()}></div>;
a ++;
`,
        output: `
const a = _$$.r({
  v: 0
});
const fn = () => a.v + 1;
function fn2() {
  return a.v + 1;
}
fn();
const c = _$$.c(() => fn());
const c2 = _$$.c(() => fn2());
const c3 = _$$.c(() => c.v + 1);
const dom = _$$.ce("div", {
  a: () => fn()
});
a.v++;
  `
    },
    {
        name: '标注comment',
        disabled: false,
        input: `
const a = {a: {a: 1}}; // @shallow
a.a.a++;
const a2 = {a: {a: 1}}; // @static
a2.a.a++;
const a3 = {a: {a: 1}}; // @reactive
`,
        output: `
        `
    },
    {
        name: '放宽jsx转译条件',
        disabled: false,
        input: `
const data = useState();
<div a={data.a()} b={data.b}>{data.c}</div>;
`,
        output: `
const data = useState();
_$$.ce("div", {
  a: () => data.a(),
  b: () => data.b
}, () => data.c);
        `
    },
    {
        name: 'props',
        disabled: false,
        input: `
function Component(props){
  return <div>{props.a}{props.b+1}</div>
}
function Component2({a: A, b, c=1}){
  let d = b+1;
  return <div>{A}{b+1}{c}</div>
}
`,
        output: `
function Component(props) {
  return _$$.ce("div", null, () => props.a.v, () => props.b.v + 1);
}
function Component2({
  a: A,
  b,
  c = 1
}) {
  let d = _$$.c(() => b.v + 1);
  return _$$.ce("div", null, A, () => b.v + 1, c);
}
        `
    },
    {
        name: 'props',
        disabled: false,
        input: `
const aa = {};
let a = 1;
aa[a];
aa.a;
a++;
`,
        output: `
const aa = {};
let a = _$$.r({
  v: 1
});
aa[a.v];
aa.a;
a.v++;
        `
    },
    
] as ICodeMap[];
