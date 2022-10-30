/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:54:34
 * @Description: Coding something
 */
import {button, div, input, style, click, $, IReactItem} from '../alins';

export function todoList () {
    const v = $(false);
    const d = $({data: false});
    d.data.value = 1 as any as boolean;
    v.value = true;
    const edit = $('');
    const list = $([{content: '1', done: false}]);
    const addItem = () => {
        list.push({content: edit.value, done: false});
        edit.value = '';
    };
    const removeItem = (index: any) => {list.splice(index.value, 1);};
    const finishItem = (item: any) => {
        item.done = !item.done.value;
    };
    return div(
        input.model(edit),
        button('提交', click(addItem)),
        div('.todo-list', $`.todo-${edit}`,
            div.for(list)((item, index) => [
                style.textDecoration(() => item.done.value ? 'line-through' : 'none')
                    .color(() => item.done.value ? '#888' : '#222'),
                $`${() => index.value + 1}:${item.content}`,
                button('删除', click(removeItem).args(index)),
                button(
                    $`${() => item.done.value ? '撤销' : '完成'}`,
                    click(finishItem).args(item)
                ),
                // todo 计划重构
                // style.textDecoration(item.done ? 'line-through' : 'none')
                //     .color(item.done ? '#888' : '#222'),
                // $`${index.value + 1}:${item.content}`,
                // button('删除', click(removeItem).args(index)),
                // button(
                //     $`${item.done ? '撤销' : '完成'}`,
                //     click(finishItem).args(item)
                // ),
            ]),
        ),
    );
}
// // function a (x) {
// //     console.log('x', x);
// // }


// // function b (a, b) {
// //     console.log('b', a, b);
// //     return a + b;
// // }