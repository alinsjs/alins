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

const data = react('World') as any;
const datab = react('bb') as any;

const object = react({
    a: 'xxx',
});

win.object = object;

mount('body',
    div('.aaa', react`#aa-${data}-aa.class-${data}[${data}=${datab}][a=${data}]:Hello ${data} ${datab}`, [
        div('.aaa:sds', [
            div(react`.aaa:sa${data}dsa-`),
            div('.aaa:sdfa')
        ])
    ])
);

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


