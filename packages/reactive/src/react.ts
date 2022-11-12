/*
 * @Author: tackchen
 * @Date: 2022-10-11 21:35:20
 * @Description: react data
 */

import {
    isStringTemplateArray, join,
    subscribe, forceUpdate, value, reactValue, getListeners, json,
    IJson, IStyleBuilder,
    IReactBindingTemplate, IReactBuilder, IReactContext,
    IReactWrap, TReactionItem, IReactItem,
    IReactObject, IComputedItem, TReactionValue, replaceValue,
} from 'alins-utils';
import {createReplacement, createTemplateReplacement} from './binding';
import {Compute, computed, subscribeReactBuilder} from './computed';
import {createProxy} from './proxy';

function bindReactive ({
    template,
    reactions,
}: IReactBindingTemplate): IReactBuilder {
    // console.log('bindReactive', template, reactions);
    return {
        templateValue () {
            return template.join('');
        },
        isEmpty () {
            return reactions.length === 0;
        },
        // todo 从div构建处传入上下文环境
        exe (context: IReactContext) {
            // debugger;
            return {template, reactions, context}; // todo
        },
        modTemplate (mod, i = template.length - 1) {
            template[i] = mod(template[i]);
        },
        type: 'react'
    };
}

export function createReactive<T> (data: T): IReactWrap<T> {
    if (isSimpleValue(data)) {
        // 值类型
        return reactiveValue(data) as IReactWrap<T>;
    }

    if (typeof data === 'object') {
        return createProxy(data as any) as IReactWrap<T>;
    }
    
    throw new Error('createReactive error');
}

export function reactiveValue<T> (value: T, isUndefined = false): IReactItem<T> {
    const changeList: Function[] = [];
    return {
        type: 'reaction',
        isUndefined () {
            return typeof value === 'undefined' || isUndefined;
        },
        get value () {
            Compute.add?.(this);
            return value;
        },
        [replaceValue] (v: T) {
            if (v === value) return;
            value = v;
        },
        set value (v: any) {
            if (v === value) return;
            if (isUndefined) isUndefined = false;
            if (v instanceof Array) v = v.join('\n');
            const old = value;
            value = v;
            changeList.forEach(fn => {fn(v, old);});
        },
        [reactValue]: true,
        [subscribe] (fn) {
            changeList.push(fn);
            return this.value;
        },
        [forceUpdate] (old = value, index) {
            changeList.forEach(fn => {fn(value, old, index);});
        },
        toJSON () {return isUndefined ? undefined : this.value;},
        [getListeners]: () => {
            // console.count('getListeners');
            return changeList;
        },
        [json] () {return value;}
    };
}

// ! 重载顺序不能更改
// 生成响应数据绑定
export function react(ts: TemplateStringsArray, ...reactions: (TReactionItem|IStyleBuilder)[]): IReactBuilder;
// 初始化响应数据
export function react<T>(data: T): IReactWrap<T>;
// es6兼容写法
export function react(data: string, ...reactions: (TReactionItem | string)[]): IReactBuilder;

// const v: boolean = false;
// const d = react(v as boolean);

export function react<T> (
    data: TemplateStringsArray | T | string,
    ...reactions: (TReactionItem | string | IStyleBuilder)[]
): IReactBuilder | IReactWrap<T> | IReactItem<T> {

    handleStyleBuilder(reactions);

    if (isStringTemplateArray(data)) {
        return bindReactive({
            template: data as unknown as string[],
            reactions: reactions as TReactionItem[],
        });
    } else if (typeof data === 'string' && reactions.length > 0) {
        return bindReactive(transArgsToTemplate(data, reactions as TReactionItem[]));
    } else {
        return createReactive<T>(data as T);
    }
}

function handleStyleBuilder (reactions: (TReactionItem | IStyleBuilder)[]) {
    // ! 兼容styleBuilder
    for (let i = 0; i < reactions.length; i++) {
        const item = reactions[i];
        if ((item as any).type === 'style')
            reactions[i] = (item as IStyleBuilder).react();
    }
}

// es6兼容写法
function transArgsToTemplate (data: string, reactions: (string|TReactionItem)[]) {
    const template = [data];
    let isLastString = true;
    for (let i = 0; i < reactions.length; i++) {
        const reaction = reactions[i];
        const isString = typeof reaction === 'string';
        if (isString) {
            isLastString ? template[template.length - 1] += reaction : template.push(reaction);
            reactions.splice(i, 1);
            i --;
        }
        if (!isLastString && !isString) {
            template.push('');
        }
        isLastString = isString; ;
    }
    if (!isLastString) template.push('');
    return {
        template,
        reactions,
    };
}

// 将 TReactionItem 转换 成 computed或者 reactItem
export function transformToReaction<T> (item: TReactionItem<T>): IReactItem<T> | IComputedItem<T> {
    return (typeof item === 'function') ? computed(item) : item;
}
// 计算TReactionItem的值
export function countReaction (item: TReactionItem) {
    return (typeof item === 'function') ? item() : item.value;
}
// 计算一次IReactBinding渲染后的值
export function countBindingValue (binding: IReactBindingTemplate) {
    return join(binding.template, binding.reactions.map(r => countReaction(r)));
}

export function isSimpleValue (v: any) {
    return typeof v !== 'object' || v === null;
}
export function isReactSimpleValue (v: any) {
    return v[reactValue] === true;
}

export function mergeReact (
    oldReact: IReactObject<any>,
    newValue: any,
    index?: number,
) {
    if (typeof oldReact === 'undefined') return;
    if (typeof newValue === 'function') return;

    // const target = toReact as any;
    // console.warn('react', react);
    // console.warn('target', property, toReact);
    // debugger;
    // if (isReaction(target[property])) {
    //     const listener = target[property][getListeners]();
       
    //     if (listener.length > 0) {
    //         react[getListeners]().push(...listener);
    //     }
    // }
    // {a: {b: 1, c: 2}, c: 2}, // 旧值
    // {a: {b: 2, d: 3}, d: 3} // 新值
    if (!isReactSimpleValue(newValue)) {
        const newKeys = Object.keys(newValue);
        // ! 对于对象 需要双向排重
        const oldTarget = oldReact as any;
        // debugger;
        for (const k in oldReact) {
            // todo 如果是arr不能按照这种方式
            const oldItem = oldTarget[k];
            const index = newKeys.indexOf(k);
            if (index !== -1) { // 旧值 新值中都有
                // 数组 index即为下标 对象也传但是无意义，这里不使用判断了
                mergeReact(oldItem, newValue[k], index);
                newKeys.splice(index, 1);
            } else { // 新值中没有
                // todo 对于动态属性没有良好的支持
                delete oldTarget[k];
                // debugger;
            }
        }
        // 新值中有旧值中没有的
        for (let i = 0; i < newKeys.length; i++) {
            const key = newKeys[i];
            oldTarget[key] = reactiveProxyValue(newValue[key]);
        }
    }
    if (oldReact) mergeListeners(oldReact, newValue, index);
    else newValue[forceUpdate](undefined, index);

}

export function mergeListeners (
    oldReact: IReactItem | IReactObject, // 被覆盖的值
    newReact: IReactItem | IReactObject, // 新值
    index?: number,
) {
    // console.count('mergeListeners');
    const arr = oldReact[getListeners]();
    if (arr.length > 0) {
        newReact[getListeners]().push(...arr);
        newReact[forceUpdate](getReactionValue(oldReact), index); // 被覆盖的数据触发更新
    }
}

export function getReactionValue (reaction: any) {
    return reaction[value] || reaction.value;
}

export function isReaction (v: any): boolean {
    return !!v?.[subscribe];
}

// export function isUndefined (v: any): boolean {
//     return isReaction(v) ?
//         (getReactionValue(v) === emptyValue) :
//         (typeof v === 'undefined');
// }

export function getReactionPureValue (data: any) {
    return isReaction(data) ? JSON.parse(JSON.stringify(data)) : data;
}

export function reactiveProxyValue (v: any) {
    // if (isReaction(v)) return v;
    if (isReaction(v)) v = v[json];
    if (!isSimpleValue(v)) return createProxy(v);
    return reactiveValue(v);
}

export function parseReactionValue (
    value: TReactionValue<string|number>,
    startIndex = 0,
    handleSimpleValue?: (v: string|number) => string,
    handleReaction?: (r: IReactItem<string | number> | IComputedItem<string | number>) => IReactItem<string | number> | IComputedItem<string | number>,
) {
    let scopeTemplate = '';
    const scopeReactions = [];
    if (typeof value === 'string' || typeof value === 'number') { // 当json值是简单类型
        scopeTemplate += handleSimpleValue ? handleSimpleValue(value) : value;
    } else if ((value as IJson).type === 'react' ) {
        // 当json值是IReactBuilder react`1-${xx}`
        // 参数是reactBuilder的时候需要合并一下 reactions
        const {template, reactions} = (value as IReactBuilder).exe({
            type: 'style',
        });
        if (reactions.length > 0) {
            scopeTemplate = createTemplateReplacement(template, startIndex);
            scopeReactions.push(...reactions);
        } else {
            scopeTemplate = template.join('');
        }
    } else {
        // 当json值是TReactionItem
        let reaction = transformToReaction(value as TReactionItem<number | string>);
        if (handleReaction) {
            reaction = handleReaction(reaction);
        }
        scopeTemplate = createReplacement(startIndex);
        scopeReactions.push(reaction);
    }
    return {reactions: scopeReactions, template: scopeTemplate};
}

export function exeReactionValue (
    value: TReactionValue<string|number>,
    onchange: (v: string|number) => void,
) {
    // const styleValue: string|number = '';
    if (typeof value === 'string' || typeof value === 'number') { // 当json值是简单类型
        return value;
    } else if ((value as IJson).type === 'react' ) {
        // 当json值是IReactBuilder react`1-${xx}`
        return subscribeReactBuilder(value as IReactBuilder, (content) => {
            // setDomStyle(style, key, content);
            onchange(content);
        }, 'style');
    } else {
        // 当json值是TReactionItem
        const reaction = transformToReaction(value as TReactionItem<number | string>);
        return reaction[subscribe](v => {
            // setDomStyle(style, key, v);
            onchange(v);
        });
    }
}

export function reactionValueToItem (value: TReactionValue<string|number>): TReactionItem<string|number> {
    if (typeof value === 'string' || typeof value === 'number') { // 当json值是简单类型
        return () => value;
    } else if ((value as IJson).type === 'react' ) {
        // 当json值是IReactBuilder react`1-${xx}`
        return () => countBindingValue((value as IReactBuilder).exe({type: 'computed'}));
    } else {
        // 当json值是TReactionItem
        return value as TReactionItem<number | string>;
    }
}

// (window as any).react = react;