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
const dom = /*#__PURE__*/_$$.ce("div", {
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
const dom = /*#__PURE__*/_$$.ce("div", {
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
/*#__PURE__*/_$$.ce("div", {
  a: () => !done.v
}, /*#__PURE__*/_$$.ce("span", null, "1"), /*#__PURE__*/_$$.ce("button", {
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
  return /*#__PURE__*/_$$.ce("div", null, () => props.b.v + 1, " ", () => props.a.v.b.c, " ");
}
function Bb({
  a,
  b,
  c: C
}, children) {
  return /*#__PURE__*/_$$.ce("div", null, () => a.v + 1, " ", () => b.v + 1, " ", () => C.v + 1, " ");
}
    `
    },
    {
        name: 'for component',
        disabled: false,
        input: `
let data = [1]
const d = <for data={data} item='item' index='index'>
  <span>{item+1}</span>
</for>
data.push(1);
`,
        output: `
let data = _$$.r({
  v: [1]
});
const d = data.v.map((item, index) => /*#__PURE__*/_$$.ce("", null, /*#__PURE__*/_$$.ce("span", null, item.v + 1)), true, "item", "index");
data.v.push(1);
    `
    },
    {
        name: 'if component',
        disabled: false,
        input: `
let i = 1
const d = <>
    <if data={i === 1}>
        <div>11</div>
    </if>
    <elseif data={i === 2}>
        <div>22</div>
    </elseif>
    <else>
        <div>33</div>
    </else>
</>
i = 2;
`,
        output: `
const _$ = _$$(true);
let i = _$$.r({
  v: 1
});
const d = /*#__PURE__*/_$$.ce("", null, _$.if(() => i.v === 1, () => /*#__PURE__*/_$$.ce("", null, /*#__PURE__*/_$$.ce("div", null, "11"))).elif(() => i.v === 2, () => /*#__PURE__*/_$$.ce("", null, /*#__PURE__*/_$$.ce("div", null, "22"))).else(() => /*#__PURE__*/_$$.ce("", null, /*#__PURE__*/_$$.ce("div", null, "33"))).end());
i.v = 2;
    `
    },
    {
        name: 'if component',
        disabled: false,
        input: `
let v = 1;

<switch data={v}>
  <case data={1} break>11</case>
  <case data={2} break>22</case>
  <default>33</default>
</switch>

v = 2;
`,
        output: `
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
document.body.appendChild(<async data={aa()} name="data">
  <div onclick={()=>{
    data ++;
  }}>{data}</div>
  <div>{data+1}</div>
</async>)
`,
        output: `
document.body.appendChild(_$$.ce(async () => {
  var data = _$$.r({
    v: await aa()
  });
  return /*#__PURE__*/_$$.ce("", null, /*#__PURE__*/_$$.ce("div", {
    onclick: () => {
      data.v++;
    }
  }, data), /*#__PURE__*/_$$.ce("div", null, () => data.v + 1));
}));
    `
    },
] as ICodeMap[];
