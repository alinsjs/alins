/*
 * @Author: tackchen
 * @Date: 2022-10-21 10:51:40
 * @Description: Coding something
 */

import {button, div, click, $} from '../alins';

function createItem () {
    return {
        a: [
            ['a1' + Math.random().toString(), 'a2' + Math.random().toString()],
            ['b1' + Math.random().toString(), 'b2' + Math.random().toString()],
        ]
    };
}

export function For3 () {
    const array = [];
    for (let i = 0; i < 2; i++) {
        array.push(createItem());
    }
    const arrayReact = $(array);
    // todo 支持返回数组
    return [
        button('add', click(() => arrayReact.push(createItem()))),
        button('clear', click(() => arrayReact.splice(0, arrayReact.length))),
        div.for(arrayReact)((item, index) => [
            div(':xxx', $`${index}`),
            div.for(item.a)((str, i) => [
                '.x3', $`.x3-${index}-${i}`,
                div.for(str)((a, ii) => [
                    $`${a}-${index}-${i}-${ii}`
                ])
            ])
        ])
    ];
}