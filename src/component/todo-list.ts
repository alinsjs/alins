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
    // const arrr = react({a: [1]});
    // arrr.a = [1, 2];

    // list[0].content;

    const addItem = () => {
        // list[0].content = '';
        // list[0] = {content: edit.value};
        list.push({content: edit.value});
        edit.value = '';
        // list[0].value = 1;
    };
    // list[0].content.value = '1';
    const removeItem = (index: IReactItem) => {
        list.splice(index.value, 1);
    };

    // const item = list[0];

    return div(
        input.model(edit)(),
        button(':提交', click(addItem)),
        div('.todo-list',
            div(':111'),
            div.for(list)((item, index) => [
                react('.todo-item:', () => index.value + 1, ':', item.content),
                // react`.todo-item:${() => index.value + 1}:${item.content}`,
                button(':删除', click(removeItem).args(index)),
            ]),
            div(':222'),
        ),
    );
}