/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:33:13
 * @Description: Coding something
 */
import {mount} from './core/mount';
import {div} from './core/builder/builder';
import {parseDomInfo} from './core/parser/info-parser';
import {react} from './core/reactive/react';

const win = (window as any);

const data = react('World');
const datab = react('bb');

// const bool = react(true);

// const object = react({
//     a: 'xxx',
// });
// // const array = react([1, 2, 3]);
// const array2 = react([{
//     a: 'xxx',
// }]);

const array = [];
for (let i = 0; i < 3; i++) {
    array.push({
        a: Math.random().toString()
    });
}
const array3 = react(array);
// const object2 = react({
//     a: {
//         b: 'bbb'
//     },
// });

// object.a.get();
// object2.a.b.get();

// object2.set('a', <any>11);
// object.set(<any>{b: 'xx'});


// const array = react([1, 2, 3]);
// const array2 = react([{a: 1}, {a: 2}, {a: 3}]);
// win.object = object;
// win.object2 = object2;
// win.array = array;
// win.array2 = array2;

// array2[0].a;
// array2[4].a;
window.addEventListener('click', () => {
    console.log(11);
}),
console.time('mounted');
console.log('time start');

const btn1 = document.createElement('button');
btn1.innerText = 'update';
btn1.onclick = () => {
    console.time('updated');
    array3.forEach(item => item.a.set(item.a.get() + 'xxx'));
    console.timeEnd('updated');
};
document.body.appendChild(btn1);
const btn2 = document.createElement('button');
btn2.innerText = 'clear';
btn2.onclick = () => {
    document.body.innerHTML = '';
};
document.body.appendChild(btn2);
window.addEventListener('click', () => {
    console.log('click');
});

setTimeout(() => {
    console.log('setTimeout');
    console.timeLog('mounted');
}, 0);
window.addEventListener('load', () => {
    console.log('load');
    console.timeLog('mounted');
});
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    console.timeLog('mounted');
});
mount('body',
    div('#app', [
        div.for(array3)((item) => [react`:${item.a}`]),
    ])
);
// mount('body',
//     div('.aaa', react`#a${object.a}-${data}-aa.class-${data}[${data}=${datab}][a=${data}]:Hello ${data} ${datab}`, [
//         div('.aaa', react`:${array[0]}-${array2[0].a}`, [
//             div(react`.aaa:sa${data}dsa-`),
//             div('.aaa:sdfa')
//         ]),
//         div.for(array3)((item, index) => ['.aaa', react`:${item}-index`]),
//         // div.if(bool)(`:data`)
//     ])
// );
console.log(win.app.childElementCount);
console.log(win.app.childNodes[win.app.childElementCount - 1]);
console.log(win.app.childNodes[win.app.childElementCount - 1].innerText);
console.log('mounted done');
console.timeLog('mounted');
win.update = () => {
    console.time('updated');
    array3.forEach(item => item.a.set(item.a.get() + 'xxx'));
    console.timeEnd('updated');
};
// data.set('');

// data.value;
win.parseDomInfo = parseDomInfo;
win.data = data;
win.datab = datab;


// function test<T> (data: T): IReactWrap<T> {
//     return data as IReactWrap<T>;
// }

// const a = test('str');
// const b = test(11);
// const c = test(true);
// const d = test({
//     x: {
//         y: 1,
//         z: 'z'
//     }
// });

// d.get();
// d.x.set({
//     y: 2,
//     z: 'z'
// });

// const e = test([{a: 12}, {a: 11}]);

// const dd = d.x.get();

// const value1 = e[0].get();
// const v11 = value1.a;
// const value2 = e[1].a.get(); // number;

// const e1 = e[1];

// d.x.del();

// const e11 = e1.a.get();

// // fg.get(1);

// const info: {
//     num: number[],
//     str: string[],
//     bool: boolean[],
// } = {
//     num: [
//         b.get(),
//         d.x.y.get(),
//     ],
//     str: [
//         a.get(),
//     ],
//     bool: [
//         c.get(),
//     ]
// };

// console.log(info);


