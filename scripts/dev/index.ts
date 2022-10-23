// /*
//  * @Author: tackchen
//  * @Date: 2022-07-11 17:17:54
//  * @Description: Coding something
//  */

// import {mount, div, comp, react, button, click, prop} from './alins';
// import {Count, CountProps} from './samples/count';
// import {For3} from './samples/for-3';
// import {Parent, testLife} from './samples/hello-world';
// import {createCss, StyleComp} from './samples/style-comp';
// import {todoList} from './samples/todo-list';
// import {Style2} from './samples/style-comp2';

// const oo = react({
//     a: {
//         b: 'ab',
//         c: {d: 'acd'}
//     },
// });

// // mount(
// //     div('Hello World'),
// //     div('Count------------------'),
// //     comp(Count),
// //     div('.x0#app',
// //         react`value=${oo.a.b}-${oo.a.c.d}`,
// //     ),
// //     div('todoList-----------'),
// //     comp(todoList),
// //     div('Parent-----------'),
// //     comp(Parent),
// //     div('For3-----------'),
// //     comp(For3),
// //     div('Count-----------'),
// //     comp(Count),
// //     div('countProps-----------'),
// //     div(() => {
// //         const count = react(1);
// //         return [
// //             button('add', (click(() => count.value ++))),
// //             comp(CountProps, prop({count})),
// //             comp(CountProps, prop({count})),
// //         ];
// //     }),
// //     div('testLife-----------'),
// //     comp(testLife),
// //     div('StyleComp-----------'),
// //     comp(StyleComp),
// // );

// mount(
//     comp(Style2)
// );


// createCss().mount();


import {
    mount, button, input, div, comp, click, react, style
} from './alins';

mount(comp(todoList));

function todoList () {
    const edit = react('');
    const list = react<{content: string, done: boolean}[]>([]);
    const addItem = () => {
        list.push({content: edit.value, done: false});
        edit.value = '';
    };
    const removeItem = (index: any) => {list.splice(index.value, 1);};
    const finishItem = (item: any) => {
        item.done = !item.done.value;
    };
    return div(
        input.model(edit)(),
        button('提交', click(addItem)),
        div('.todo-list', react`.todo-${edit}`,
            div.for(list)((item, index) => [
                style.textDecoration(() => item.done.value ? 'line-through' : 'none')
                    .color(() => item.done.value ? '#888' : '#222'),
                react`${() => index.value + 1}:${item.content}`,
                button('删除', click(removeItem).args(index)),
                button(
                    react`${() => item.done.value ? '撤销' : '完成'}`,
                    click(finishItem).args(item)
                ),
                // todo 计划重构
                // style.textDecoration(item.done ? 'line-through' : 'none')
                //     .color(item.done ? '#888' : '#222'),
                // react`${index.value + 1}:${item.content}`,
                // button('删除', click(removeItem).args(index)),
                // button(
                //     react`${item.done ? '撤销' : '完成'}`,
                //     click(finishItem).args(item)
                // ),
            ]),
        ),
    );
}

// function a (x) {
//     console.log('x', x);
// }


// function b (a, b) {
//     console.log('b', a, b);
//     return a + b;
// }