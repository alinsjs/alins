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
        name: 'map base',
        disabled: false,
        input: `
console.log(item, index)
arr.map((item, index)=>{
  let aa = 1;
  aa ++;
  console.log(item.a + index);
  return <div b={item.a+1}>{index+1}{aa+1}</div>
})
console.log(item)
`,
        output: `
console.log(item, index);
arr.map((item, index) => {
  let aa = _$$.r({
    v: 1
  });
  aa.v++;
  console.log(item.v.a + index.v);
  return /*#__PURE__*/_$$.ce("div", {
    b: () => item.v.a + 1
  }, () => index.v + 1, () => aa.v + 1);
}, true, "item", "index");
console.log(item);
    `
    },
    {
        name: 'map不返回jsx',
        disabled: false,
        input: `
function map(){
  arr.map((item, index)=>{
    let aa = 1;
    aa ++;
    console.log(item.a + index, aa);
  })
}
`,
        output: `
function map() {
  arr.map((item, index) => {
    let aa = _$$.r({
      v: 1
    });
    aa.v++;
    console.log(item.a + index, aa.v);
  });
}
    `
    },
    {
        name: 'map嵌套',
        disabled: false,
        input: `
function map(){
  arr.map((item, index)=>{
    return arr2.map((item, index)=>{
      return <div b={item.a+1}></div>
    })
  })
}
function map2(){
  arr.map((item, index)=>{
    return arr2.map((item, index)=>{
      return item.a+1;
    })
  })
}
`,
        output: `
function map() {
  arr.map((item, index) => {
    return arr2.map((item, index) => {
      return /*#__PURE__*/_$$.ce("div", {
        b: () => item.v.a + 1
      });
    }, true, "item", "index");
  }, true, "item", "index");
}
function map2() {
  arr.map((item, index) => {
    return arr2.map((item, index) => {
      return item.a + 1;
    });
  });
}
    `
    },
    {
        name: 'map+if、switch',
        disabled: false,
        input: `
function map(){
  arr.map((item, index)=>{
    if(index>2){
      return <div>{item.a}</div>
    }
    return <div>{index}</div>
  })
}
function map2(){
  arr.map((item, index)=>{
    switch(index) {
      case 0: return <i>{index}</i>;
      case 1: {console.log(2);break;}
      case 2: return <i>{item.a}</i>;
    }
    return <div>{item}</div>
  })
}
`,
        output: `
function map() {
  arr.map((item, index) => {
    const _$ = _$$();
    return _$.if(() => index.v > 2, () => {
      return /*#__PURE__*/_$$.ce("div", null, () => item.v.a);
    }).end(() => {
      return /*#__PURE__*/_$$.ce("div", null, index);
    });
  }, true, "item", "index");
}
function map2() {
  arr.map((item, index) => {
    const _$ = _$$();
    return _$.switch(() => index.v, [{
      c: () => {
        return /*#__PURE__*/_$$.ce("i", null, index);
      },
      v: 0
    }, {
      c: () => {
        console.log(2);
        return;
      },
      v: 1,
      b: true
    }, {
      c: () => {
        return /*#__PURE__*/_$$.ce("i", null, () => item.v.a);
      },
      v: 2
    }]).end(() => {
      return /*#__PURE__*/_$$.ce("div", null, item);
    });
  }, true, "item", "index");
}
    `
    }
] as ICodeMap[];
