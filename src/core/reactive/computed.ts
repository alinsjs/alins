/*
 * @Author: tackchen
 * @Date: 2022-10-17 08:45:21
 * @Description: Coding something
 */

import {createReactive, forceUpdate, index, IReactBase, IReactItem, subscribe} from './react';

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

export interface IComputedItem<T = any> extends IReactItem<T> {
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
    const value = get();
    Compute.add = null;

    const react = reactiveComputed(get, set, value) as IReactItem;
    reacts.forEach(item => item[subscribe]((v, old) => {
        react[forceUpdate]();
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
        [subscribe] (fn) {
            changeList.push(fn);
            return this.value;
        },
        [forceUpdate] () {
            const old = value;
            const v = this.value;
            changeList.forEach(fn => {fn(v, old);});
        }
    };
}