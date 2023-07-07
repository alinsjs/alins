/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-07 20:44:29
 */
import {JSX as React} from 'packages/core/src/element/element';
import {createContext} from 'packages/core/src/context';

const w = window as any;
w.React = React;
const addEnv = (data: any) => {Object.assign(w, data);};

const if3Base = () => {
    const list: any[] = [];
    const ctx = createContext();
    const data = ctx.$({a: 1, b: 1, c: 1});
    const container = document.createElement('div');
    /*
        const dom = <div>
            {
                ()=>{
                    if(data.a === 1){
                        return <div>{'a1'}</div>
                    }else if(data.a === 2){
                        if(data.b === 1){
                            return <div>{'b1'}</div>
                        }else if(data.b === 2){
                            if(data.c === 1){
                                return <div>{'c1'}</div>
                            }else if(data.c === 2){
                                return <div>{'c2'}</div>
                            }
                        }
                    }
                }
            }
        </div>
     */
    const dom = <div
        id={'test1'}
    >
        {
            ctx.if(() => data.a === 1, () => {
                return <div>{'a1'}</div>;
            }).elif(() => data.a === 2, () => {
                return ctx.if(() => data.b === 1, () => {
                    return <div>{'b1'}</div>;
                }).elif(() => data.b === 2, () => {
                    return <div>
                        {ctx.if(() => data.c === 1, () => {
                            return <div>{'c1'}</div>;
                        }).elif(() => data.c === 2, () => {
                            return <div>{'c2'}</div>;
                        }).end()}
                    </div>;
                }).end();
            }).end()
        }
    </div>;
    container.appendChild(dom);
    document.body.appendChild(container);

    return {container, data, list, collect: () => {list.push(container.innerText);}};
};

export default [
    {
        name: '基础if-else',
        disabled: false,
        test () {
            const result: any[] = [];
            const container = document.createElement('div');
            document.body.appendChild(container);
            const collect = () => result.push(container.innerText);
            const append = dom => container.appendChild(dom);
            // const Child = () => <div>child</div>;
            const dom = (() => {
                const ctx = createContext();
                const str = ctx.$('1');
                const str2 = ctx.$('s2');
                w.str = str;
                w.str2 = str2;
                return ctx.if(() => str.value === '1', () => {
                    return <div>{str}{str2}
                        {/* <Child>11</Child> */}
                    </div>;
                }).else(() => {
                    return <div>else</div>;
                });
            })();
            append(dom);
            collect();
            w.str.value = '2';
            collect();
            w.str2.value = 's22';
            collect();
            w.str.value = '1';
            collect();
            return result;
        },
        expect: ['1s2', 'else', 'else', '1s22']
    },
    {
        name: '基础if-else-2',
        disabled: false,
        test () {
            const result: any[] = [];
            const container = document.createElement('div');
            document.body.appendChild(container);
            const collect = () => result.push(container.innerText);
            const append = dom => container.appendChild(dom);
            // const Child = () => <div>child</div>;
            
            const ctx = createContext();
            const str = ctx.$('1');
            const str2 = ctx.$('1');
            /**
                if(str === '1'){
                    return <div>
                        <span>00</span>
                        {
                            (()=>{
                                if(str2.value === '2'){
                                    return <div>11</div>
                                }
                                return <div>22</div>;
                            })()
                        }
                    </div>
                }
                 */
            const dom = ctx.if(() => str.value === '1', () => {
                return <div>
                    <span>0</span>
                    {
                        ctx.if(() => str2.value === '1', () => <div>11</div>)
                            .else(() => <div>22</div>)
                    }
                </div>;
            }).else(() => {
                return <div>else</div>;
            });
            append(dom);
            collect();
            str.value = '2';
            collect();
            str2.value = '2';
            collect();
            str.value = '1';
            collect();
            str.value = '2';
            collect();
            str2.value = '1';
            collect();
            str.value = '1';
            collect();
            return result;
        },
        expect: ['0\n11', 'else', 'else', '0\n22', 'else', 'else', '0\n11']
    },
    {
        name: '三层嵌套if-1',
        disabled: false,
        test () {
            const {data, collect, list} = if3Base();
            collect();
            data.a = 2;
            collect();
            data.b = 2;
            collect();
            data.b = 1;
            collect();
            data.c = 2;
            collect();
            data.b = 2;
            collect();
            return list;
        },
        expect: ['a1', 'b1', 'c1', 'b1', 'b1', 'c2']
    },
    {
        name: '三层嵌套if-2',
        disabled: false,
        test () {
            const {data, collect, list} = if3Base();
            collect();
            data.a = 2;
            collect();
            data.b = 2;
            collect();
            data.c = 2;
            collect();
            data.a = 1;
            collect();
            data.a = 2;
            collect();
            window.data = data;
            return list;
        },
        expect: ['a1', 'b1', 'c1', 'c2', 'a1', 'c2']
    },


    // {
    //     name: '两层嵌套if',
    //     // disabled: false,
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
    // {
    //     name: '两层嵌套if-2',
    //     // disabled: false,
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
    //                     }).elif(() => b.value === 3, () => {
    //                         return div({$child: ['b3']});
    //                     });
    //                 })
    //             ]
    //         }).mount(container);
    //         result.push(container.innerText);
    //         console.log('1----------------------------------------------');
    //         a.value = 2;
    //         result.push(container.innerText);
    //         console.log('2----------------------------------------------');
    //         b.value = 2;
    //         result.push(container.innerText);
    //         console.log('3----------------------------------------------');
    //         a.value = 1;
    //         result.push(container.innerText);
    //         console.log('4----------------------------------------------');
    //         a.value = 2;
    //         result.push(container.innerText);
    //         // console.log('5----------------------------------------------');
    //         // b.value = 3;
    //         // result.push(container.innerText);
    //         // console.log('6----------------------------------------------');
    //         // a.value = 1;
    //         // result.push(container.innerText);
    //         // console.log('7----------------------------------------------');
    //         // a.value = 2;
    //         // result.push(container.innerText);
    //         return result;
    //     },
    //     expect: ['a1', 'b1', 'b2', 'a1', 'b2']
    // },
    // {
    //     name: '三层嵌套if',
    //     // disabled: false,
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
    //     // disabled: false,
    //     test () {

    //         const result: any[] = [];

    //         const {data: testIf, container} = ifBase();

    //         testIf.a.value = 2;
    //         testIf.b.value = 2;
    //         testIf.c.value = 2;
            
    //         testIf.a.value = 1;
    //         testIf.a.value = 2;

    //         result.push(container.innerText);

    //         console.log(container.innerText);

    //         document.body.appendChild(container);

    //         addEnv({testIf, container});
    //         return result;
    //     },
    //     expect: ['c2']
    // },
];