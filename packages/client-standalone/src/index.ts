/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 17:48:30
 * @Description: Coding something
 */

import {
    IRefData, IGeneralElement, _if, _switch,
    ContextTool, createContext,
    IAttributes,
    Renderer,
    reactiveBindingEnable,
    map
} from 'alins';

type IValueCond<T> = (()=>T)|IRefData<T>;
type IBoolCond = IValueCond<boolean>;

type IDomGenerator = ()=>IGeneralElement|IGeneralElement[];

// let a = alins.react(1)

// alins.watch(a, ()=>{})

// alins.computed(()=>{

// });

export {react, watch, computed} from 'alins';
import {react, watch, computed} from 'alins';

// alins.Dom('div', {

// }, [

// ]);
export function Dom (name: string, attributes: IAttributes = {}, children: any[] = []) {
    if (Array.isArray(attributes)) {
        children = attributes;
        attributes = {};
    }
    return ContextTool.ce(name, attributes, children);
}
// alins.component(fn, {}, [])
export function Component (
    fn: (attributes: IAttributes, children: any[])=>IGeneralElement|IGeneralElement[],
    attributes: IAttributes = {},
    children: any[] = []
) {
    if (Array.isArray(attributes)) {
        children = attributes;
        attributes = {};
    }
    return ContextTool.ce(fn, attributes, children);
}


// alins.div({}, [
//     alins.span(),
// ]);


// alins.if(
//     ()=>{}, ()=>{},
//     alins.elseif(()=>{}, ()=>{

//     }),
//     alins.else(()=>{

//     }),
// );

export function If (condition: IBoolCond, generator: IDomGenerator, ...items: any[][]) {
    let result = _if(condition, generator, createContext());
    for (const item of items) {
        if (item.length === 2) result = result.elif(item[0], item[1]);
        else if (item.length === 1) result = result.else(item[0]);
    }
    return result.end();
}
export function ElseIf (condition: IBoolCond, generator: IDomGenerator) {
    return [condition, generator];
}
export function Else (generator: IDomGenerator) {
    return [generator];
}

// alins.switch(()=>a,
//     alins.case(1, ()=>{}, true),
//     alins.case(1, ()=>{}, true),
//     alins.case(1, ()=>{}, true),
//     alins.default(1, ()=>{}, true),
// )
export function Switch (condition: IValueCond<any>, generator: IDomGenerator) {
    return _switch(condition, generator, createContext()).end();
}

interface ICaseItem {
    v?: any,
    c: IDomGenerator,
    b?: boolean
}
export function Case (value: any, generator: IDomGenerator, brk?: boolean) {
    const data: ICaseItem = {
        v: value,
        c: generator,
    };
    if (typeof brk === 'boolean') {
        data.b = brk;
    }
    return data;
}
export function Default (generator: IDomGenerator, brk?: boolean) {
    const data: ICaseItem = {c: generator, };
    if (typeof brk === 'boolean') data.b = brk;
    return data;
}


// alins.async(a(), data=>{

// });
export function Async<T=any> (
    promise: Promise<T>,
    generator: (data: T)=>IGeneralElement|IGeneralElement[]
) {
    return ContextTool.ce(async () => {
        const data = await promise;
        return generator(data);
    });
}

// alins.for(data, (item, index)=>{

// })
export function For<T=any> (
    data: T[],
    generator: (item: T, index: number)=>IGeneralElement|IGeneralElement[]
) {
    return map(data, generator, true, 'item', 'index');
}

// alins.show(aa, ()=>{

// })
export function Show (condition: IBoolCond, generator: IDomGenerator) {
    const element = generator();
    const calls: ((v: boolean)=>void)[] = [];
    const handleSingle = (el: any) => {
        if (!el) return;
        if (Renderer.isFragment(el)) {
            const children = el.children;
            for (const item of children) {
                handleSingle(item);
            }
        } else if (Array.isArray(el)) {
            for (const item of el) {
                handleSingle(item);
            }
        } else {
            calls.push(v => {el.style.display = v ? '' : 'none';});
        }
    };
    handleSingle(element);
    reactiveBindingEnable(condition, (v) => {
        calls.forEach(call => {call(v);});
    });
    return element;
}

export const alins = {
    react,
    watch,
    computed,
    If,
    ElseIf,
    Else,
    Switch,
    Case,
    Default,
    For,
    Async,
    Show,
    Dom,
    Component,
};