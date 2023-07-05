// import {createContext} from 'packages/core/src/holder/context';

import {JSX as React} from 'packages/core/src/element/element';
import {createContext} from 'packages/core/src/context';
import {react} from 'packages/reactive/src';
import {watch} from 'packages/reactive/src';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-04 17:28:23
 * @Description: Coding something
 */


window.react = react;
window.watch = watch;
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

function mainOrigin () {
    let str = '11';
    if (str === '11') {
        str = '22';
        return <div>111</div>;
    }
    return <div>222</div>;
}
function mainOrigin2 () {
    const a = 'a';
    let b = 'b';
    win.a = a;
    win.b = b;
    if (a === 'aa') {
        b = 'bb';
    }
    return <div>{b}</div>;


}
function mainOrigin3 () {
    const a = 'a';
    let b = 'b';
    win.a = a;
    win.b = b;
    if (a === 'aa') {
        b = 'bb';
    }
    return <div>{b}</div>;
}

function mainOrigin4 () {
    const a = 'a';
    let b = 'b';
    const c = 'c';
    win.a = a;
    win.b = b;
    if (a === 'aa') {
        b = 'bb';
        switch (c) {
            case 'b1': return <div>b1</div>;
            case 'b2': b = 'xxx'; break;
        }
        return <div>aa</div>;
    }
    return b === 'b' ? <div>{b}</div> : <h1>{b}2</h1>;
}

// TODO 有bug 
/**
 a.value = 'a1'
b.value = 'bb'
a.value = 'a2'
 */
function main () {
    const ctx = createContext();
    const a = ctx.$('a2');
    const b = ctx.$('b');
    const c = ctx.$('c');
    win.a = a;
    win.b = b;
    win.c = c;
    win.ctx = ctx;
    return ctx.if(() => a.value === 'a1', () => {
        // b.value = 'bb'; // ! todo 这里打开有bug
        return ctx.switch(c, [{
            value: 'c1',
            call: () => <div>c1</div>,
        }, {
            value: 'c2',
            call: () => {b.value = 'c2';},
            brk: true
        }]).end(() => {
            return  <div>c-end</div>;
        });
    }).else(() => {
        return ctx.if(()=>b.value === 'b', ()=><div>b1</div>)
            .else(()=><h1>b2</h1>);
        // return <div>{b}</div>
    });

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