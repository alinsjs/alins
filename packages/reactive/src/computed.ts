/*
 * @Author: tackchen
 * @Date: 2022-10-17 08:45:21
 * @Description: Coding something
 */

import {
    forceUpdate, getListeners,  reactValue, subscribe,
    IComputedItem, IReactItem, TComputedFunc, IReactBuilder, TReactContextType, IReactBindingTemplate, replaceValue
} from 'alins-utils';
import {
    countBindingValue, isSimpleValue,
} from './react';

export interface TComputedObject<T> {
    get(): T;
}

export interface TComputedObjectSet<T> extends TComputedObject<T>{
    set: ((v: T, old: T) => void);
}

export const Compute: {
    add: ((item: IReactItem)=>void) | null;
} = {
    add: null,
};

export type TComputedBuilder<T> = TComputedObjectSet<T> | TComputedFunc<T> | TComputedObject<T>

export interface IComputed {
    <T>(target: TComputedObjectSet<T> ): IReactItem<T>;
    <T>(target: TComputedFunc<T> | TComputedObject<T> ): IComputedItem<T>;
}

export const computed: IComputed = (target) => {
    const isFunc = typeof target === 'function';
    const get = isFunc ? target : target.get;
    const set = isFunc ? null : (target as TComputedObjectSet<any>).set;

    // ! 依赖收集
    const reacts: IReactItem[] = [];
    Compute.add = (item: IReactItem) => {
        reacts.push(item);
    };
    
    const value = get();
    Compute.add = null;

    const react = reactiveComputed(get, set, value) as IReactItem;
    reacts.forEach(item => item[subscribe]((v, old, index) => {
        console.log('trigger', item, item.value, react[getListeners](), react.value);
        item[replaceValue](v); // ! 需要把依赖的react数据修改一下，不然存在闭包引用的是旧数据的问题
        react[forceUpdate](old, index);
    }));
    return react;
};

function reactiveComputed<T> (
    get: TComputedObjectSet<T>['get'],
    set: TComputedObjectSet<T>['set'] | null,
    value: T,
): IReactItem<T> {
    const changeList: Function[] = [];
    return {
        type: 'reaction',
        isUndefined: () => typeof value === 'undefined',
        get value () {
            Compute.add?.(this);
            value = get();
            return value;
        },
        set value (v: any) {
            if (!set) {
                console.warn('对只读computed设置值无效');
                return;
            }
            set(v, this.value);
        },
        [replaceValue] (v: T) {
            if (v === value) return;
            if (set) set(v, value);
        },
        [subscribe] (fn) {
            changeList.push(fn);
            return value;
        },
        [forceUpdate] () {
            const old = value;
            const v = this.value;
            changeList.forEach(fn => {fn(v, old);});
        },
        [reactValue]: isSimpleValue(value),
        [getListeners]: () => changeList,
        toJSON: () => value,
    };
}

export function computedReactBuilder (
    builder: IReactBuilder,
    type: TReactContextType = 'computed'
) {
    if (!builder.isEmpty()) {
        return computedBindingTemplate(builder.exe({type}));
    }
    return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // return {[subscribe]: (v: any) => builder.templateValue()};
}

export function computedBindingTemplate (data: IReactBindingTemplate) {
    return computed(() => countBindingValue(data));
}

export function subscribeReactBuilder (
    builder: IReactBuilder,
    onchange: (v: string, old: string) => void,
    type: TReactContextType = 'computed',
) {
    const compute = computedReactBuilder(builder, type);
    return compute ?
        compute[subscribe](onchange) :
        builder.templateValue();
}

// (window as any).computedReactBuilder = computedReactBuilder;

// const num = react(1);
// const binding = react`${num}-1`;
// const b = computedReactBuilder(binding);
// b[subscribe](v => {
//     console.log(v);
// });

// function test () {
//     const num = react(1);
//     const binding = react`${num}-1`;
//     const {template, reactions} = binding.exe({
//         type: 'style',
//     });
//     const templateRep = createTemplateReplacement(template);
//     const v = reactiveTemplate(templateRep, reactions, (content, old) => {
//         console.warn('111', content, old);
//     }, true);
//     console.warn('v', v);
//     return num;
// }
// function test () {
//     const num = react(1);
//     const binding = react`${num}-1`;
//     const v = computedReactBuilder(binding)[subscribe]((v, old) => {
//         console.warn('111222', v, old);
//     });
//     console.warn('v', v);
//     return num;
// }