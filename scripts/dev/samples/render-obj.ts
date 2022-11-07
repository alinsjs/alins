/*
 * @Author: tackchen
 * @Date: 2022-10-24 07:30:54
 * @Description: Coding something
 */
import {div, $, button, click, value} from '../alins';

export function renderObject () {
    const data = $({
        a: {
            b: 'ab',
            c: {d: 'acd'}
        },
        arr: [1, 2, 3]
    });

    const arr = $([1, 2, 3]);

    const index = $(-1);

    return div('.x0#app',
        $`value=${data.a.b}-${data.a.c.d}-${data.a.c.e}`,
        div.for(data.arr)((item, index) => $`${index}: ${item}`),
        div($`----arr---${arr[0]}`),
        div.for(arr)((item, index) => $`${index}: ${item}`),
        button($`change object :${index}`, click(() => {
            index.value ++;
            data[value] = ([
                { // 0
                    a: {
                        b: 'new b',
                        c: {d: 'new d', e: 'new e'},
                    },
                    arr: [4, 5, 6]
                }, { // 1
                    arr: [7, 8]
                }, { // 2
                    a: {
                        c: {d: 'new d2', e: 'new e2'},
                    },
                },
                {}, // 3
                // 1,
                { // 4
                    a: {
                        c: {d: 'new d2', e: 'new e2'},
                    },
                },
            ])[index.value] || {};
            arr[value] = ([
                [4, 5, 6],
                [7, 8],
                [],
                1,
                [9, 10],
            ])[index.value] || [];
        }))
    );
}