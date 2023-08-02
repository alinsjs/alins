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
        name: 'test',
        disabled: false,
        input: `
var a = 1; 
var list = [1,2,3,4]

document.body.appendChild(
  <>
    <button onclick={()=> {
      a++; 
      list.push(a);
    }}>
      {a}
    </button>
    {
      list.map((v, i)=>{
        return <div>{i}:{v}</div>
      })
    }
  </>
);
`,
        output: `
var a = _$$.r({
  v: 1
});
var list = _$$.r({
  v: [1, 2, 3, 4]
});
document.body.appendChild( /*#__PURE__*/_$$.ce("", null, /*#__PURE__*/_$$.ce("button", {
  onclick: () => {
    a.v++;
    list.v.push(a.v);
  }
}, a), list.v.map((v, i) => {
  return /*#__PURE__*/_$$.ce("div", null, i, ":", v);
}, true, "v", "i")));
    `
    },
] as ICodeMap[];
