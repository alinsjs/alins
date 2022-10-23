/*
 * @Author: tackchen
 * @Date: 2022-07-11 17:17:54
 * @Description: Coding something
 */

import {mount, div, comp, react, button, click, prop} from './alins';
import {Count, CountProps} from './samples/count';
import {For3} from './samples/for-3';
import {Parent, testLife} from './samples/hello-world';
import {createCss, StyleComp} from './samples/style-comp';
import {todoList} from './samples/todo-list';
import {Style2} from './samples/style-comp2';

const oo = react({
    a: {
        b: 'ab',
        c: {d: 'acd'}
    },
});

// mount(
//     div('Hello World'),
//     div('Count------------------'),
//     comp(Count),
//     div('.x0#app',
//         react`value=${oo.a.b}-${oo.a.c.d}`,
//     ),
//     div('todoList-----------'),
//     comp(todoList),
//     div('Parent-----------'),
//     comp(Parent),
//     div('For3-----------'),
//     comp(For3),
//     div('Count-----------'),
//     comp(Count),
//     div('countProps-----------'),
//     div(() => {
//         const count = react(1);
//         return [
//             button('add', (click(() => count.value ++))),
//             comp(CountProps, prop({count})),
//             comp(CountProps, prop({count})),
//         ];
//     }),
//     div('testLife-----------'),
//     comp(testLife),
//     div('StyleComp-----------'),
//     comp(StyleComp),
// );

mount(
    comp(Style2)
);


createCss().mount();