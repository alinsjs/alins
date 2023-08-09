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
        name: 'map static',
        disabled: false,
        input: `
arr.map((item, index)=>{
  let aa = 1;
  aa ++;
  console.log(item.a + index);
  return <div b={item.a+1}>{index+1}{aa+1}</div>
})
console.log(item)
`,
        output: `
arr.map((item, index) => {
  let aa = _$$.r({
    v: 1
  });
  aa.v++;
  console.log(item.a + index);
  return _$$.ce("div", {
    b: item.a + 1
  }, index + 1, () => aa.v + 1);
});
console.log(item);
  `
    },
    {
        name: 'map base',
        disabled: false,
        input: `
console.log(item, index)
let arr = []
arr.push(1);
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
let arr = _$$.r({
  v: []
});
arr.v.push(1);
arr.v.map((item, index) => {
  let aa = _$$.r({
    v: 1
  });
  aa.v++;
  console.log(item.v.a + index.v);
  return _$$.ce("div", {
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
        name: 'map嵌套', // 第一个是返回的jsx 第二个不是 所以没有被响应处理
        disabled: false,
        input: `
let arr = [], arr2 = [];
arr.push(1);
arr2.push(1);
function map(){
  return arr.map((item, index)=>{
    return arr2.map((item, index)=>{
      return <div b={item.a+1}></div>
    })
  })
}
function map2(){
  return arr.map((item, index)=>{
    return arr2.map((item, index)=>{
      return item.a+1;
    })
  })
}
`,
        output: `
let arr = _$$.r({
    v: []
  }),
  arr2 = _$$.r({
    v: []
  });
arr.v.push(1);
arr2.v.push(1);
function map() {
  return arr.v.map((item, index) => {
    return arr2.v.map((item, index) => {
      return _$$.ce("div", {
        b: () => item.v.a + 1
      });
    }, true, "item", "index");
  }, true, "item", "index");
}
function map2() {
  return arr.v.map((item, index) => {
    return arr2.v.map((item, index) => {
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
let arr = [];
arr.push(1);
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
const _$ = _$$();
let arr = _$$.r({
  v: []
});
arr.v.push(1);
function map() {
  arr.v.map((item, index) => {
    return _$.if(() => index.v > 2, () => {
      return _$$.ce("div", null, () => item.v.a);
    }).end(() => {
      return _$$.ce("div", null, index);
    });
  }, true, "item", "index");
}
function map2() {
  arr.v.map((item, index) => {
    return _$.switch(() => index.v, [{
      c: () => {
        return _$$.ce("i", null, index);
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
        return _$$.ce("i", null, () => item.v.a);
      },
      v: 2
    }]).end(() => {
      return _$$.ce("div", null, item);
    });
  }, true, "item", "index");
}
    `
    }
] as ICodeMap[];
