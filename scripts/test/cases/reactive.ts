/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-01 22:52:45
 */

import {react, observe, computed, watch, IReactBindingResult} from 'packages/reactive';

export default [
    {
        name: 'Test observe',
        disable: true,
        test () {
            const a = react(1);
            const list: any = [];
            list.push(observe(() => {
                list.push(a.value);
                return a.value;
            }));
            a.value = 2;
            a.value = 3;
            const b = react({a: {b: 1}});
            list.push(observe(() => {
                list.push(b.a.b);
                return b.a.b;
            }));
            b.a.b = 2;
            return list;
        },
        expect: [1, 1, 2, 3, 1, 1, 2]
    },
    {
        name: 'Test computed',
        disable: true,
        test () {
            const list:any[] = [];
            const data = react({a: 1});
      
            const c1 = computed(() => data.a + 1);
            const c2 = computed(() => c1.value + 1);
            const c3 = computed({
                get: () => ({x: c2.value + 1}),
                set: (v, ov) => {
                    data.a = v.x;
                    list.push(ov.x);
                }
            });

            list.push(data.a, c1.value, c2.value, c3.value.x);
            data.a = 2;
            list.push(c1.value, c2.value, c3.value.x);
            c3.value = {x: 3};
            list.push(c1.value, c2.value, c3.value.x);
            c3.value.x = 4;
            return list;
        },
        expect: [1, 2, 3, 4, 3, 4, 5, 5, 4, 5, 6]
    },
    {
        name: 'Test watch',
        test () {
            const a = react(1);
            const b = react(2);
            // const b = react({a: 1});
            const c1 = computed(() => a.value + b.value + 1);

            const list:any[] = [];

            watch(() => {
                console.warn('debug:  watch');
                return c1.value + a.value;
            }, (...args) => {
                console.log('watchwatchwatch', ...args);
                console.log(a.value, b.value, c1.value);
                list.push(args.slice(0, 2));
            });

            a.value = 2;
            a.value = 3;
            b.value = 3;
            return list;
        },
        expect: [[7, 5], [9, 7], [10, 9]]
    },
    {
        name: 'Test react binding',
        test () {
            const list:any[] = [];
            const a = react(1);
            const b = react({a: 1});
            const c1 = computed(() => a.value + b.a + 1);

            const binding = react`${a}-${() => b.a}-${c1}` as IReactBindingResult;


            list.push(binding((v, ov) => {

                list.push(ov, v);
            }));

            a.value = 2;
            b.a = 3;

            return list;
        },
        expect: ['1-1-3', '1-1-3', '2-1-4', '2-1-4', '2-3-6']
    },
    {
        name: 'computed 分支逻辑',
        test () {
            const list:any[] = [];
            const bool = react(true);
            const a = react(1);
            const b = react(2);
            const c = computed(() => bool.value ? a.value : b.value);
            list.push(c.value);
            a.value = 11;
            list.push(c.value);
            bool.value = false;
            list.push(c.value);
            b.value = 22;
            list.push(c.value);
            return list;
        },
        expect: [1, 11, 2, 22]

    }
];