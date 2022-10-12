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

// const object = react({
//     a: 'xxx',
// });

// win.object = object;

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


// function test<T=object> (data: T): IReactWrap<T> {

//     return {} as IReactWrap<T>;
// }

// const d = test({
//     x: {
//         y: 1
//     }
// });

// const v1 = d.x.y;

// const ddd = test('1');

// const v = ddd.get();

// const num = d.x.y.get();

// const f = test([{a: 12}, {a: 11}, {a: 12}]);
// const value1 = f[0].get();
// const value2 = f[1].a.set();

// f[1].a;
