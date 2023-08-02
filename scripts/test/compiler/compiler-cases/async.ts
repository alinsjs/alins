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
        name: 'async base',
        disabled: false,
        input: `
async function fn() {
  let b = await aa();
  b = await aa();
  return <div>{b}</div>;
}
`,
        output: `
async function fn() {
  let b = _$$.r({
    v: await aa()
  });
  b.v = await aa();
  return /*#__PURE__*/_$$.ce("div", null, b);
}
    `
    },
    {
        name: 'async if',
        disabled: false,
        input: `
async function fn() {
  let b = await aa();
  if(b) {
    let b = await aa();
    return 1
  }
  b = await aa();
  return <div>{b}</div>;
}
`,
        output: `
async function fn() {
  const _$ = _$$();
  let b = _$$.r({
    v: await aa()
  });
  return _$.if(() => b.v, async () => {
    let b = await aa();
    return 1;
  }).end(_$$.mnr(async () => {
    b.v = await aa();
    return /*#__PURE__*/_$$.ce("div", null, b);
  }));
}
    `
    }
] as ICodeMap[];
