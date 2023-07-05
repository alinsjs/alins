// import {createContext} from 'packages/core/src/holder/context';

import {JSX as React} from 'packages/core/src/element/element';
import {createContext} from 'packages/core/src/context';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-04 17:28:23
 * @Description: Coding something
 */


const win = window as any;

const delay = (time = 3000) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};


function xxx () {
    if (a.value === 3) {
        a.value = 2;
    }
}

function mainOrigin(){
    let str = '11';
    if(str === '11') {
        str = '22';
        return <div>111</div>
    }
    return <div>222</div>
}
function mainOrigin2(){
    let a = 'a';
    let b = 'b';
    win.a = a;
    win.b = b;
    if(a === 'aa') {
        b = 'bb';
    }
    return <div>{b}</div>


}
function mainOrigin3(){
    let a = 'a';
    let b = 'b';
    win.a = a;
    win.b = b;
    if(a === 'aa') {
        b = 'bb';
    }
    return <div>{b}</div>
}

function mainOrigin4(){
    let a = 'a';
    let b = 'b';
    let c = 'c';
    win.a = a;
    win.b = b;
    if(a === 'aa') {
        b = 'bb';
        switch(c){
            case 'b1': return <div>b1</div>;
            case 'b2': b = 'xxx'; break;
        }
        return <div>aa</div>;
    }
    return <div>{b}</div>
}


function main () {


    const ctx = createContext();
    let a = ctx.$('a');
    let b = ctx.$('b');
    let c = ctx.$('c');
    win.a = a;
    win.b = b;
    win.c = c;
    return ctx.if(()=>a.value === 'aa', () => {
        b.value = 'bb';
        return ctx.switch(c, [{
            value: 'b1',
            call: ()=><div>b1</div>,
        },{
            value: 'b2',
            call: ()=>{b.value = 'xxx'},
            brk: true
        }]).end(()=>{
            return <div>aa</div>;
        })
    }).else(()=>{
        return <div>{b}</div>
    })

    // const ctx = createContext();
    // let a = ctx.$('a');
    // let b = ctx.$('b');
    // win.a = a;
    // win.b = b;
    // return ctx.switch(a, [
    //     {
    //         value: 'a1',
    //         call(){b.value = 'a1'},
    //     },{
    //         value: 'a2',
    //         call(){b.value = 'a2'},
    //         brk: true,
    //     },{
    //         value: 'a3',
    //         call(){b.value = 'a333';return <h>{b}</h>},
    //     },{
    //         value: 'a4',
    //         call(){b.value = 'a4'},
    //     },{
    //         call(){b.value = 'default';},
    //     }
    // ]).end(()=>{
    //     return <div>{b}</div>
    // });

    // const ctx = createContext();
    // let a = ctx.$('a');
    // let b = ctx.$('b');
    // win.a = a;
    // win.b = b;
    // ctx.if(() => a.value === 'aa', () => {
    //     console.log('b.value == bb');
    //     b.value = 'bb';
    // }).end();
    // return <div>{b}</div>

    // var a=1;

    // const ctx = createContext();
    // let str = ctx.$('11');
    // win.str = str;
    // return ctx.if(() => str.value === '11', () => {
    //     str.value = '22';
    //     console.log(111)
    //     return <></div>;
    // }).else(() => {
    //     console.log(222)
    //     return <div>222</div>;
    // });


    // const data = ctx.dynamic(async () => {
    //     await delay();
    //     str.value = '111';
    //     return <div>{str}</div>;
    // }, true);
    // if (data) return data;
    // win.str = str;
    // return <div>{str}</div>;
}

document.body.appendChild(main());

// function dynamic () {
//     const c = createContext();
  
//     const a = c.$(1);
//     const dom = c.if(() => (a.value === 1), () => {
//         const s = Date.now();
//         a.value = 2;
//         return <div>{s}</div>;
//     }).end();
//     if (dom) return dom;
    
//     return <div>{a}</div>;
// }