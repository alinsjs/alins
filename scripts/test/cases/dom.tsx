/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-07 08:12:45
 */

import {JSX as React} from 'packages/core/src/element/element';
import {computed, react} from 'packages/reactive/src';

// function Child(props){
//     props.props
//     return <div onclick={{listener: ()=>1, prevent: true, once}}></div>
// }

// const a = <Child ></Child>
// d.addEventListener
// a.addEventListener('click', e=>{})


function createBaseEnv () {
    const result: any[] = [];
    const container = document.createElement('div');
    document.body.appendChild(container);
    const collect = () => result.push(container.innerText);
    const append = dom => container.appendChild(dom);
    return {
        addResult: (v) => result.push(v),
        collect,
        append,
        getResult: () => result,
        $: react,
    };
}

function a({props}){
    return <div></div>
}

export default [
    {
        name: '基础jsx',
        disabled: false,
        test () {
            const {addResult, collect, append, getResult} = createBaseEnv();
            const a = react(1);
            const a2 = computed(() => a.value + 2);
            const dom = <div
                onclick={(e) => a.value = 2}
                a={() => a.value + 1}
                a2 = {a2}
            >
                {a}
            </div>;
            append(dom);
            collect();
            a.value = 3;
            collect();
            dom.click();
            collect();
            addResult(dom.getAttribute('a'));
            addResult(dom.getAttribute('a2'));
            return getResult();
        },
        expect: ['1', '3', '2', '3', '4']
    },
    {
        name: 'reactive-object',
        disabled: false,
        test () {

            const {addResult, collect, append, getResult} = createBaseEnv();
            
            const data = react({a: 1, b: 2});
            const dom = <div
                onclick={() => data.a = 2}
                a={() => data.a + 1}
                b = {() => data.b}
            >
                {() => data.a}-{() => data.b}
            </div>;
            append(dom);
            collect();
            data.a = 3;
            data.b = 4;
            collect();
            dom.click();
            collect();
            addResult(dom.getAttribute('a'));
            addResult(dom.getAttribute('b'));
            return getResult();
        },
        expect: ['1-2', '3-4', '2-4', '3', '4']
    },
    {
        name: 'reactive-class',
        disabled: false,
        test () {

            const {addResult, append, getResult, $} = createBaseEnv();
            /**
             * const data = {a: 'a'}
             * const dom = <div onclick={()=>data.a='aaa'} class={`${data.a}-plus`}>{data.a}</div>
             */
            const data = react({a: 'a'});
            const dom = <div
                onclick={() => data.a = 'aaa'}
                class={$`${()=>data.a}-plus`}
            >{()=>data.a}
            </div>;
            append(dom);
            addResult(dom.className)
            data.a = 'aa';
            addResult(dom.className);
            dom.click()
            addResult(dom.className);
            return getResult();
        },
        expect: ['a-plus', 'aa-plus', 'aaa-plus']
    },
    {
        name: 'reactive-event',
        disabled: false,
        test () {
            const {collect, append, getResult} = createBaseEnv();
            const a = react(1);
            const dom = <div
                onclick={{listener: () => a.value++, once: true}} 
                // todo 待补充其他修饰符
            >{a}
            </div>;
            append(dom);
            collect();
            dom.click();
            collect();
            dom.click();
            collect();
            return getResult();
        },
        expect: ['1', '2', '2']
    }
];