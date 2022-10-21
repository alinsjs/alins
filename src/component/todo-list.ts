/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:54:34
 * @Description: Coding something
 */
import {button, div, input} from 'src/core/builder/builder';
import {click} from 'src/core/event/on';
import {IReactItem, react} from 'src/core/reactive/react';


export function todoList () {
    const edit = react('');

    const list = react<{
        content: string
    }[]>([]);
    const addItem = () => {
        list.push({content: edit.value});
        edit.value = '';
    };
    const removeItem = (index: IReactItem) => {
        list.splice(index.value, 1);
    };

    return div(
        input.model(edit)(),
        button(':提交', click(addItem)),
        div('.todo-list',
            div(':111'),
            div.for(list)((item, index) => [
                react`.todo-item:${() => index.value + 1}:${item.content}`,
                button(':删除', click(removeItem).args(index)),
            ]),
            div(':222'),
        )
    );
}