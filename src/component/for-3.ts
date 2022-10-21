/*
 * @Author: tackchen
 * @Date: 2022-10-21 10:51:40
 * @Description: Coding something
 */

import {button, div} from 'src/core/builder/builder';
import {click} from 'src/core/event/on';
import {react} from 'src/core/reactive/react';

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
    const arrayReact = react(array);
    // todo 支持返回数组
    // return div(
    //     button('add', click(() => arrayReact.push(createItem()))),
    //     button('clear', click(() => arrayReact.splice(0, arrayReact.length))),
    //     div.for(arrayReact)((item, index) => [
    //         div(':xxx', react`${index}`),
    //         div.for(item.a)((str, i) => [
    //             '.x3', react`.x3-${index}-${i}`,
    //             div.for(str)((a, ii) => [
    //                 react`${a}-${index}-${i}-${ii}`
    //             ])
    //         ])
    //     ])
    // );
    const result = div.for(arrayReact)((item, index) => [
        div(':xxx', react`${index}`),
        div.for(item.a)((str, i) => [
            '.x3', react`.x3-${index}-${i}`,
            div.for(str)((a, ii) => [
                react`${a}-${index}-${i}-${ii}`
            ])
        ])
    ]);

    debugger;
    return result;
}