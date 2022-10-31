/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:54:34
 * @Description: Coding something
 */
import {button, div, input, style, click, $} from '../alins';

export function todoList () {
    const edit = $('');
    const list = $([]);
    const addItem = () => {
        list.push({content: edit.value, done: false});
        edit.value = '';
    };
    const removeItem = (index) => { list.splice(index.value, 1); };
    const finishItem = (item) => { item.done = !item.done.value; };

    const itemStyle = (item) => {
        return style.textDecoration(() => {
            debugger;
            return item.done.value ? 'line-through' : 'none';
        })
            .color(() => item.done.value ? '#888' : '#222');
    };

    return [
        input.model(edit),
        button('提交', click(addItem)),
        div('.todo-list',
            div.for(list)((item, index) => [
                itemStyle(item),
                $`${() => index.value + 1}:${item.content}`,
                button('删除', click(removeItem).args(index)),
                button(
                    $`${() => item.done.value ? '撤销' : '完成'}`,
                    click(finishItem).args(item)
                ),
            ]),
        ),
    ];
}
// // function a (x) {
// //     console.log('x', x);
// // }


// // function b (a, b) {
// //     console.log('b', a, b);
// //     return a + b;
// // }