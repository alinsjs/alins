/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-30 11:13:26
 */
import {JSX as React} from 'packages/core/src/element/element';
import {createContext} from 'packages/core/src/context';
import {createTestBase} from '../test-util';

// const w = window as any;
// w.React = React;
// const addEnv = (data: any) => {Object.assign(w, data);};

const if3Base = () => {
    const {list, ctx, data, container, collect, str} = createTestBase();
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

    return {container, data, list, collect, str};
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
            const ctx = createContext();
            const str = ctx.$('1');
            const str2 = ctx.$('s2');
            /*
                const dom = ()=>{
                    if(str === '1'){
                        return <div>{str}{str2}</div>;
                    }else{
                        return <div>else</div>;
                    }
                }
            */
            const dom = (() => {
                // w.str = str;
                // w.str2 = str2;
                return ctx.if(() => str.value === '1', () => {
                    return <div>{str}{str2}
                        {/* <Child>11</Child> */}
                    </div>;
                }).else(() => {
                    return <div>else</div>;
                }).end();
            })();
            append(dom);
            collect();
            str.value = '2';
            collect();
            str2.value = 's22';
            collect();
            str.value = '1';
            collect();
            return result;
        },
        expect: ['1s2', 'else', 'else', '1s22']
    },
    {
        name: '基础if-else2',
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
            const str2 = ctx.$('s2');
            /*
                const dom = ()=>{
                    if(str === '1'){
                        return <div>{str}{str2}</div>;
                    }
                    let b = 1
                    b ++;
                    return <div>b{b}</div>;
                }
            */
            const dom = (() => {
                // w.str = str;
                // w.str2 = str2;
                return ctx.if(() => str.value === '1', () => {
                    return <div>{str}{str2}</div>;
                }).end(() => {
                    const b = ctx.$(1);
                    b.value ++;
                    return <div>b{b}</div>;
                });
            })();
            debugger;
            append(dom);
            collect();
            str.value = '2';
            collect();
            str2.value = 's22';
            collect();
            str.value = '1';
            collect();
            return result;
        },
        expect: ['1s2', 'b2', 'b2', '1s22'],
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
                }else{
                    return <div>else</div>;
                }
                 */
            const dom = ctx.if(() => str.value === '1', () => {
                return <div>
                    <span>0</span>
                    {
                        ctx.if(() => str2.value === '1', () => <span>11</span>)
                            .else(() => <span>22</span>).end()
                    }
                </div>;
            }).else(() => {
                return <div>else</div>;
            }).end();
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
        expect: ['011', 'else', 'else', '022', 'else', 'else', '011']
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
            // @ts-ignore
            // window.data = data;
            return list;
        },
        expect: ['a1', 'b1', 'c1', 'c2', 'a1', 'c2']
    },


];