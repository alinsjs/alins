/*
 * @Author: tackchen
 * @Date: 2022-10-17 08:45:21
 * @Description: Coding something
 */

import {createReactive, IReactItem, subscribe} from './react';

export type TWatchFunc<T = any> = (...args: any[]) => T;

interface TWatchObject {
    set?: null | ((v: any, old: any) => void);
    get(): any;
}

export const Compute: {
    add: ((item: IReactItem)=>void) | null;
} = {
    add: null,
};

export function computed<T> (target: TWatchFunc<T> | TWatchObject ) {
    const isFunc = typeof target === 'function';
    const get = isFunc ? target : target.get;
    const set = isFunc ? null : target.set;

    const reacts: IReactItem[] = [];
    Compute.add = (item: IReactItem) => {
        reacts.push(item);
    };
    let value = get();
    Compute.add = null;
    const react = createReactive(value) as IReactItem;
    const originSet = react.set;
    reacts.forEach(item => item[subscribe](() => {
        value = get();
        originSet(value);
    }));
    react.set = set ? (v: any) => {
        set(v, value);
    } : () => {
        console.warn('对只读computed设置值无效');
    };
    return react;
}