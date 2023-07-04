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

function main () {

    var a=1;

    const ctx = createContext();
    let str = ctx.$('11');
    win.str = str;
    return ctx.if(() => str.value === '11', () => {
        str.value = '22';
        console.log(111)
        return null;
    }).else(() => {
        console.log(222)
        return <div>222</div>;
    });


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