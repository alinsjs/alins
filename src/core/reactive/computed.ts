/*
 * @Author: tackchen
 * @Date: 2022-10-17 08:45:21
 * @Description: Coding something
 */

import {createReactive, IReactItem, subscribe} from './react';

export type TWatchFunc<T = any> = (...args: any[]) => T;

export const Compute: {
    add: ((item: IReactItem)=>void) | null;
} = {
    add: null,
};

export function computed<T> (fn: TWatchFunc<T> ) {

    const reacts: IReactItem[] = [];
    Compute.add = (item: IReactItem) => {
        reacts.push(item);
    };
    const value = fn();
    Compute.add = null;
    const react = createReactive(value) as IReactItem;

    reacts.forEach(item => item[subscribe](() => {
        react.set(fn());
    }));

    return react;
}