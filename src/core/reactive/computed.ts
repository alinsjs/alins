/*
 * @Author: tackchen
 * @Date: 2022-10-17 08:45:21
 * @Description: Coding something
 */

import {createReactive, forceUpdate, IReactItem, subscribe} from './react';

export type TComputedFunc<T = any> = (...args: any[]) => T;

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

export interface IComputedItem<T = any> {
    $index?: IComputedItem<number>;
    get(): T;
    get value(): T;
    [forceUpdate](): void;
    [subscribe](fn: (v:T, old:T) => void):  T;
}

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
    Compute.add = (item: IReactItem) => { reacts.push(item); };
    let value = get();
    Compute.add = null;

    const react = createReactive(value) as IReactItem;
    const originSet = react.set;
    reacts.forEach(item => item[subscribe]((nv: any, old) => {
        originSet(nv);
        value = old;
    }));
    react.set = set ? (v: any) => {
        set(v, value);
    } : () => {
        console.warn('对只读computed设置值无效');
    };
    return react;
};
