/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-09 21:28:50
 */
import {JSX as React} from 'packages/core/src/element/element';
import {createContext} from 'packages/core/src/context';
import {createTestBase} from '../test-util';

// const w = window as any;

export default [
    {
        name: '基础switch',
        disabled: false,
        test () {
            const {list, ctx, data, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;

            /*
            const dom = ()=>{
                switch(data.a) {
                    case 0: list.push(0);
                    case 1: list.push(1);
                    case 2: list.push(2);break;
                    case 3: list.push(3);break;
                }
                return <div>end</div>;
            }
            */
            const dom = (() => {
                return ctx.switch(() => data.a, [
                    {
                        value: 0,
                        brk: false,
                        call: () => {list.push('0');},
                    },
                    {
                        value: 1,
                        brk: false,
                        call: () => {list.push('1');},
                    },
                    {
                        value: 2,
                        brk: true,
                        call: () => {list.push('2');},
                    },
                    {
                        value: 3,
                        brk: true,
                        call: () => {list.push('3');},
                    },
                ]).end(() => {
                    return <div>end</div>;
                });
            })();
            append(dom);
            collect();
            data.a = 3;
            collect();
            return list;
        },
        expect: ['1', '2', 'end', '3', 'end']
    },
    {
        name: 'switch + return jsx',
        disabled: false,
        test () {
            const {list, ctx, data, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;

            /*
            const dom = ()=>{
                switch(data.a) {
                    case 0: return <div>c0</div>;
                    case 1: return <div>c1</div>;
                    case 2: list.push(2);
                    case 3: return <div>c3</div>;
                }
                return <div>end</div>;
            }
            */
            const dom = (() => {
                return ctx.switch(() => data.a, [
                    {
                        value: 0,
                        brk: false,
                        call: () => <div>c0</div>,
                    },
                    {
                        value: 1,
                        brk: false,
                        call: () => <div>c1</div>,
                    },
                    {
                        value: 2,
                        brk: false,
                        call: () => {list.push('2');},
                    },
                    {
                        value: 3,
                        brk: true,
                        call: () => <div>c3</div>,
                    },
                ]).end(() => {
                    return <div>end</div>;
                });
            })();
            append(dom);
            collect();
            data.a = 0;
            collect();
            data.a = 2;
            collect();
            data.a = 3;
            collect();
            data.a = 4;
            collect();
            data.a = 3;
            collect();
            return list;
        },
        expect: ['c1', 'c0', '2', 'c3', 'c3', 'end', 'c3']
    },

];