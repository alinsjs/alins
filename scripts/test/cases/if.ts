/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-02 13:07:03
 */

import {$if} from 'packages/core/src/controller/if';
import {div} from 'packages/core/src/dom-factory';
import {react} from 'packages/reactive/src';

const w = window as any;
const addEnv = (data: any) => {Object.assign(w, data);};

const ifBase = () => {
    const a = react(1);
    const b = react(1);
    const c = react(1);
    const container = document.createElement('div');
    div({
        id: 'test1',
        $child: [
            $if(() => a.value === 1, () => {
                return div({$child: ['a1']});
            }).elif(() => a.value === 2, () => {
                return $if(() => b.value === 1, () => {
                    return div({$child: ['b1']});
                }).elif(() => b.value === 2, () => {
                    return $if(() => c.value === 1, () => {
                        return div({$child: ['c1']});
                    }).elif(() => c.value === 2, () => {
                        return div({$child: ['c2']});
                    });
                });
            })
        ]
    }).mount(container);
    return {container, data: {a, b, c}};
};

export default [
    // {
    //     name: '基础if',
    //     // disable: true,
    //     test () {

    //         const result: any[] = [];

    //         const a = react(1);
    //         const container = document.createElement('div');
    //         div({
    //             id: 'test1',
    //             $child: [
    //                 $if(() => a.value === 1, () => {
    //                     return div({$child: ['a1']});
    //                 }).elif(() => a.value === 2, () => {
    //                     return div({$child: ['a2']});
    //                 }).else(() => {
    //                     return div({$child: ['a3']});
    //                 })
    //             ]
    //         }).mount(container);
    //         result.push(container.innerText);
    //         a.value = 2;
    //         result.push(container.innerText);
    //         a.value = 100;
    //         result.push(container.innerText);
    //         a.value = 1;
    //         result.push(container.innerText);
    //         return result;
    //     },
    //     expect: ['a1', 'a2', 'a3', 'a1']
    // },
    // {
    //     name: '两层嵌套if',
    //     // disable: true,
    //     test () {

    //         const result: any[] = [];

    //         const a = react(1);
    //         const b = react(1);
    //         const container = document.createElement('div');
    //         div({
    //             id: 'test1',
    //             $child: [
    //                 $if(() => a.value === 1, () => {
    //                     return div({$child: ['a1']});
    //                 }).elif(() => a.value === 2, () => {
    //                     return $if(() => b.value === 1, () => {
    //                         return div({$child: ['b1']});
    //                     }).elif(() => b.value === 2, () => {
    //                         return div({$child: ['b2']});
    //                     });
    //                 })
    //             ]
    //         }).mount(container);
    //         result.push(container.innerText);
    //         a.value = 2;
    //         result.push(container.innerText);
    //         b.value = 2;
    //         result.push(container.innerText);
    //         b.value = 1;
    //         a.value = 1;
    //         result.push(container.innerText);
    //         b.value = 2;
    //         a.value = 2;
    //         result.push(container.innerText);
    //         return result;
    //     },
    //     expect: ['a1', 'b1', 'b2', 'a1', 'b2']
    // },
    {
        name: '两层嵌套if-2',
        // disable: true,
        test () {

            const result: any[] = [];

            const a = react(1);
            const b = react(1);
            const container = document.createElement('div');
            div({
                id: 'test1',
                $child: [
                    $if(() => a.value === 1, () => {
                        return div({$child: ['a1']});
                    }).elif(() => a.value === 2, () => {
                        return $if(() => b.value === 1, () => {
                            return div({$child: ['b1']});
                        }).elif(() => b.value === 2, () => {
                            return div({$child: ['b2']});
                        });
                    })
                ]
            }).mount(container);
            result.push(container.innerText);
            console.log('1----------------------------------------------');
            a.value = 2;
            result.push(container.innerText);
            console.log('2----------------------------------------------');
            b.value = 2;
            result.push(container.innerText);
            console.log('3----------------------------------------------');
            a.value = 1;
            result.push(container.innerText);
            console.log('4----------------------------------------------');
            a.value = 2;
            result.push(container.innerText);
            return result;
        },
        expect: ['a1', 'b1', 'b2', 'a1', 'b2']
    },
    // {
    //     name: '三层嵌套if',
    //     // disable: true,
    //     test () {

    //         const result: any[] = [];

    //         const {data: testIf, container} = ifBase();

    //         testIf.a.value = 2;
    //         testIf.b.value = 2;
    //         testIf.b.value = 1;
    //         testIf.c.value = 2;
    //         testIf.b.value = 2;
    //         result.push(container.innerText);

    //         addEnv({testIf});
    //         return result;
    //     },
    //     expect: ['c2']
    // },
    // {
    //     name: '三层嵌套if2',
    //     // disable: true,
    //     test () {

    //         const result: any[] = [];

    //         const {data: testIf, container} = ifBase();

    //         // testIf.a.value = 2;
    //         // testIf.b.value = 2;
    //         // testIf.c.value = 2;
            
    //         // testIf.a.value = 1;
    //         // testIf.a.value = 2;

    //         result.push(container.innerText);

    //         console.log(container.innerText);

    //         document.body.appendChild(container);

    //         addEnv({testIf, container});
    //         return result;
    //     },
    //     expect: ['c2']
    // },
];