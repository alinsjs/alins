/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 17:48:30
 * @Description: Coding something
 */

import type {
    IRefData,
    IAttributes,
    IElement,
} from 'alins';

import {
    ref, reactive, watch, computed,
    _if, _switch,
    Renderer,
    reactiveBindingEnable,
    map,
    _$ce,
    isProxy,
    mount,
} from 'alins';

export { ref, reactive, watch, computed, mount } from 'alins';

type IValueCond<T> = (()=>T)|IRefData<T>;
type IBoolCond = IValueCond<boolean>;

type IElements = IElement|IElement[];

type IDomGenerator = ()=>IElements;

// let a = alins.react(1)

// alins.watch(a, ()=>{})

// alins.computed(()=>{

// });

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

const DomNames = [
    'a', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'canvas', 'code', 'pre', 'table', 'th', 'td', 'tr', 'video', 'audio',
    'ol', 'select', 'option', 'p', 'i', 'iframe', 'img', 'input', 'label', 'ul', 'li', 'span', 'textarea', 'form', 'br', 'tbody',

    'abbr', 'article', 'aside', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'caption', 'cite', 'del', 'details', 'dialog',
    'em', 'embed', 'figure', 'footer', 'header', 'hr', 'menu', 'nav', 'noscript',
    'object', 'progress', 'section', 'slot', 'small', 'strong', 'sub', 'summary', 'sup', 'template',
    'title', 'var',
] as const;

export type TDomName = typeof DomNames[number];

interface IDom {
    (name: TDomName, attributes?: IAttributes, children?: (any[])): IElements;
    (name: string, attributes?: IAttributes, children?: (any[])): IElements;
}

type IDoms = {
    [tagName in TDomName]: (attributes?: IAttributes, children?: (any[])) => IElements;
}

/*
Dom.div({attr: 1}, [
    Dom.div('111')
])
Dom.div({attr: 1}, 111)
Dom.div(111)
Dom('div', 111)
*/

// @ts-ignore
export const Dom: IDom & IDoms = (() => {
    const builder = (
        name: string,
        attributes: IAttributes = {},
        children?: (any[])
    ) => createEl(name, attributes, children);
    DomNames.forEach(name => {
        builder[name] = (attributes: any, children: any) => createEl(name, attributes, children);
    });
    return builder;
})();


/*
 Component(Hello, {}, [Dom.div('11')])
 Component(Hello, [Dom.div('11')])
 Component(Hello, {})
 Component(Hello)
*/
type IComponentFn = (attributes: IAttributes, children: any[])=>IElements;

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
): IElements {
    if (typeof children === 'undefined') {
        if (Array.isArray(attributes)) {
            children = attributes;
            attributes = {};
        } else if (typeof attributes !== 'object' || isProxy(attributes)) {
            children = [ attributes ];
            attributes = {};
        } else {
            children = [];
        }
    }
    // @ts-ignore
    return _$ce(tag, attributes, children);
}


/**
If(()=>a.v === 1, ()=>Dom.div(1)
    ElseIf(()=>a.v === 2, ()=>Dom.div(2))
    Else(()=>Dom.div('else'))
)
 */

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

/**
Switch(a,
    Case(1, ()=>Dom.div('a is 1')),
    Case(2, ()=>Dom.div('a is 2')),
    Default(()=>Dom.div('default')
)
 */
// ! standalone 不支持break逻辑，break是在编译时处理的
type ICaseItem = [any, IDomGenerator];

export function Switch (condition: IValueCond<any>, ...cases: ICaseItem[]) {
    // @ts-ignore
    return _switch(condition, cases).end();
}

export function Case (value: any, generator: IDomGenerator): ICaseItem {
    return [ value, generator ];
}
export function Default (generator: IDomGenerator): ICaseItem {
    return [ null, generator ];
}

/*
Async(fetchData(), data=>{
    return Dom.div('111')
})
*/

export function Async<T=any> (
    promise: Promise<T>,
    generator: (data: T)=>IElements,
) {
    // @ts-ignore
    return _$ce(async () => {
        const data = await promise;
        return generator(data);
    });
}

/*
For(list, (item, index)=>{
    return Dom.div('11');
});
*/
export function For<T=any> (
    data: T[],
    generator: (item: T, index: number)=>IElements,
) {
    // @ts-ignore
    return map(data, generator, true, 'item', 'index');
}

/*
Show(()=>a.v, Dom.div('111'))
*/
export function Show (condition: IBoolCond, element: IElements) {
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
    mount,
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