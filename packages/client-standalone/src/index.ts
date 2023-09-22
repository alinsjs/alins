/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 17:48:30
 * @Description: Coding something
 */

import {
    IRefData, IGeneralElement, _if, _switch,
    IAttributes,
    Renderer,
    reactiveBindingEnable,
    map,
    _$ce,
} from 'alins';

type IValueCond<T> = (()=>T)|IRefData<T>;
type IBoolCond = IValueCond<boolean>;

type IDomGenerator = ()=>IGeneralElement|IGeneralElement[];

// let a = alins.react(1)

// alins.watch(a, ()=>{})

// alins.computed(()=>{

// });

export { ref, reactive, watch, computed } from 'alins';
import { ref, reactive, watch, computed } from 'alins';

export function join (
    ts: TemplateStringsArray, ...reactions: any[]
): any[] {
    const result: any[] = [];
    for (let i = 0; i < reactions.length; i++)
        result.push(ts[i], reactions[i]);
    return result;
}

// alins.Dom('div', {

// }, [

// ]);

const MainDomNames = [
    'a', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'canvas', 'code', 'pre', 'table', 'th', 'td', 'tr', 'video', 'audio',
    'ol', 'select', 'option', 'p', 'i', 'iframe', 'img', 'input', 'label', 'ul', 'li', 'span', 'textarea', 'form', 'br', 'tbody',

    'abbr', 'article', 'aside', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'caption', 'cite', 'del', 'details', 'dialog',
    'em', 'embed', 'figure', 'footer', 'header', 'hr', 'menu', 'nav', 'noscript',
    'object', 'progress', 'section', 'slot', 'small', 'strong', 'sub', 'summary', 'sup', 'template',
    'title', 'var',
] as const;

interface IDom {
    (name: string, attributes?: IAttributes, children?: (any[])): ReturnType<typeof _$ce>;
    [tagName in typeof MainDomNames]: (attributes?: IAttributes, children?: (any[])) => ReturnType<typeof _$ce>;
}

export function Dom (name: string, attributes: IAttributes = {}, children?: (any[])) {
    return createEl(name, attributes, children);
}


// alins.component(fn, {}, [])
type IComponentFn = (attributes: IAttributes, children: any[])=>IGeneralElement|IGeneralElement[];

export function Component (
    fn: IComponentFn,
    attributes: IAttributes|(any[]) = {},
    children?: (any[])|any,
) {
    return createEl(fn, attributes, children);
}

function createEl (
    tag: IComponentFn|string,
    attributes: IAttributes|(any[]) = {},
    children?: (any[])|any,
) {
    if (typeof children === 'undefined') {
        if (Array.isArray(attributes)) {
            children = attributes;
            attributes = {};
        } else {
            children = [];
        }
    }
    // @ts-ignore
    return _$ce(tag, attributes, children);
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
    // @ts-ignore
    let result = _if(condition, generator);
    for (const item of items) {
        if (item.length === 2) result = result.elif(item[0], item[1]);
        else if (item.length === 1) result = result.else(item[0]);
    }
    return result.end();
}
export function ElseIf (condition: IBoolCond, generator: IDomGenerator) {
    return [ condition, generator ];
}
export function Else (generator: IDomGenerator) {
    return [ generator ];
}

// alins.switch(()=>a,
//     alins.case(1, ()=>{}, true),
//     alins.case(1, ()=>{}, true),
//     alins.case(1, ()=>{}, true),
//     alins.default(1, ()=>{}, true),
// )
export function Switch (condition: IValueCond<any>, generator: IDomGenerator) {
    // @ts-ignore
    return _switch(condition, generator).end();
}


type ICaseItem = [any, IDomGenerator, boolean|undefined];

export function Case (value: any, generator: IDomGenerator, brk?: boolean): ICaseItem {
    return [ value, generator, brk ];
}
export function Default (generator: IDomGenerator, brk?: boolean): ICaseItem {
    return [ null, generator, brk ];
}


// alins.async(a(), data=>{

// });
export function Async<T=any> (
    promise: Promise<T>,
    generator: (data: T)=>IGeneralElement|IGeneralElement[]
) {
    // @ts-ignore
    return _$ce(async () => {
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
    // @ts-ignore
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
    ref,
    reactive,
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