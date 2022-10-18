/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:33:13
 * @Description: Coding something
 */
import {mount} from './core/mount';
import {button, div, input, span, TBuilderArg} from './core/builder/builder';
import {parseDomInfo} from './core/parser/info-parser';
import {react} from './core/reactive/react';
import {$case, $for, $if, $switch, $while} from './core/controller/controller';
import {IElementBuilder} from './core/element/transform';
import {computed} from './core/reactive/computed';
import {click, on} from './core/event/on';
import {comp} from './core/comp/comp';
import {hello} from './hello';
import {prop} from './core/comp/prop';
import {slot} from './core/comp/slot';

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
for (let i = 0; i < 2; i++) {
    array.push({
        a: [
            ['a1' + Math.random().toString(), 'a2' + Math.random().toString()],
            ['b1' + Math.random().toString(), 'b2' + Math.random().toString()],
            // ['c1' + Math.random().toString(), 'c2' + Math.random().toString()],
            // 'b' + Math.random().toString(),
            // 'c' + Math.random().toString(),
        ]
    });
}
const array3 = react(array);

// array3.$set(1, {});


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
    array3.forEach(item => {
        item.a.forEach(i2 => {
            i2.forEach(i3 => {
                i3.value += 'xxx';
                // i3.set(i3.get() + 'xxx');
            });
        });
    });
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

// 3*3*3的数据

// 旧版本根据for 传递 memo方案
// 17个元素使用了缓存 13个未使用 3个不是for 1个根元素

// todo 理论上最佳方案
// 不可缓存元素 1个根元素 x1. x2 .x3 .x4, 可缓存元素 29的

const bool = react(true);
const num = react(1);
const num1 = react(3);
const num2 = computed({
    get () {
        return num.value + num1.value + 3;
    },
    set (v, old) {
        console.log(v, old);
        num1.value = v;
    }
});

const add = () => {num.value++;};


mount('body',
    div('.x0#app',
        react`/span:aa${num}aa`,
        ':111.xxx#aa',
        div(':11'),
        span.if(() => num.value > 1)(react`:if-${num}`)
            .elif(() => num.value < 0)(react`/div:elif-${() => num.value + 1}`)
            .else(react`/div:else`, click(add)),
        input.bind(num, 'number')(),
        
        // span.if(() => num.value > 1)(react`/div:if-${num}`)
        //     .elif(() => num.value < 0)(react`/div:elif-${num}`)
        //     .else(react`:else`),
        // // .else(react`:!!${bool}`),
        // div.switch(num)
        //     .case(1)(react`:case1-${num}`)
        //     .case(2)(react`:case2-${num}`),
        comp(hello,
            prop({num}),
            // emit({add})
            slot(div(react`:a-child-${num}`))
        ),
        // comp.if(() => num.value > 1)(hello)
        //     .else('/div:111'),
        // comp.show(() => num.value > 1),
        // comp.switch(num)
        //     .case(1)(hello)
        //     .case(2)(hello),
        
        // comp.for(array3)(hello),

    ),
);

// mount('body',
//     div('.x0#app',
//         // ! 前置使缓存for变得简单
//         // div('.x2'),
//         // div('.x3'),
//         // div.for(array3)((item, index) => [ '.x1',
//         //     // div('.x2', react`:x2-${index}`),
//         //     div(react`:${index}`),
//         //     div(react`:${index}`),
//         // ]),
//         // div.for(array3)((item, index) => [
//         //     div(':xxx'),
//         //     div.for(item.a)((str, i) => [
//         //         '.x3', react`.x3-${index}-${i}`,
//         //         div.for(str)((a, ii) => [
//         //             react`:${a}-${index}-${i}-${ii}`
//         //         ])
//         //     ])
//         // ]),
//         div(react`:computed-${() => num.value + 1}`),
//         div(react`:computed-${() => num.value + 2}`),
//         div(react`:computed-${num2}`),
//         span.if(() => num.value > 1)(react`:if-${num}`)
//             .elif(() => num.value < 0)(react`:elif-${num}`)
//             .else(react`:else`),
//         span.show(() => num.value > 1)(react`:show-${num2}`),
//         input.bind(num, true)('[style=color:#f44]'), // react`:show-${num2}`
//         div.bind(num, true)('[contenteditable=true]'), // react`:show-${num2}`
//         // .elif(() => num.value < 0)(react`${num.value - 1}`)
//         // .else()
//         // div.if(() => num.value > 1)(react`:${bool}`),

//         // .else(react`:!!${bool}`),
//         div.switch(num)
//             .case(1)(react`:case1-${num}`)
//             .case(2)(react`:case2-${num}`),
//         button(click(add), ':add')
//         // div.for(array3)((item, index) => [ '.x1',
//         //     // div('.x2', react`:x2-${index}`),
//         //     div.for(item.a)((str, i) => [ '.x2',
//         //         // '.x3', react`:x3-${index}-${i}`,
//         //         div.for(str)((a, ii) => [ '.x3',
//         //             react`:${a}-${index}-${i}-${ii}`
//         //         ])
//         //     ])
//         // ]),
//         // div.for(array3)((item, index) => [ '.x1',
//         //     // div('.x2', react`:x2-${index}`),
//         //     div.for(item.a)((str, i) => i.get() === 0 ? [] : [])
//         // ]),
//         // div.for(array3)((item, index) => a),
        
//     )
// );

const funcA = (d) => {
    console.log('funcA');
    console.log(d);
    console.log('funcA2');
};
const funcB = (d) => {
    console.log('funcB');
    console.log(d);
    console.log('funcB2');
};

const funcC = () => {
    console.log('funcC');
    return 'c';
};

const test = [
    funcA(funcC()),
    funcB(funcC() + 1)
];


// mount('body',
//     div('#app', [
//         $for(array3, (item, index) => div([
//             $for(item.a, (str, i) => div(react`.aa:${str}-${index}-${i}`) )
//         ])),
//     ])
// );


// $for(array3, (item, index) => {
//     return index.get() > 0 ? div([
//         $for(item.a, (str, i) => div(react`.aa:${str}-${index}-${i}`) )
//     ]) : div();
// });


// div('#app', [
//     (() => {
//         return 1 as any;
//     })()
// ]);

// div('#app', [
//     $if(array3.length === 1, div())
//         .$elif()
//         .else(),
//     $switch(array3.length, {
//         11: () => div(),
//         [$case(11)]: () => div(),
//         aa: () => div()
//     })
// ]);
// const x: any = {};
// div('#app', [
//     $for(array3, item => div([
//         $if(item.a, div(react`.aa:${str}`)
//             .$elif()
//             .else(),
        
//     ]))
// ]);
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
console.log(win.app?.childElementCount);
console.log(win.app?.childNodes[win.app?.childElementCount - 1]);
// console.log(win.app?.childNodes[win.app?.childElementCount - 1].innerText);
console.log('mounted done');
console.timeLog('mounted');
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


