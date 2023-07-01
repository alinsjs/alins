/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 11:18:42
 * @Description: Coding something
 */

import {util, IRefData} from 'alins-utils';
import {observe, createProxy, wrapReactive} from './proxy';
import {isDepReactive} from './proxy';

export interface IComputedObject<T> {
    get(): T;
    set?: ((v: T, old: T, path: string) => void);
}

// ! computed 都为ref，且都是shallow
export function computed<T> (target:(()=>T)|IComputedObject<T>): IRefData<T>|{value: T} {
    const isFunc = typeof target === 'function';
    const get = isFunc ? target : target.get;
    const set = isFunc ? null : (target as IComputedObject<T>).set;

    let proxy: IRefData<T>;

    const value = observe(get, () => {
        // ! 每次都需要重新get一下 因为可能代码逻辑分支有变化导致出现了没有收集到的依赖
        proxy[util].forceWrite(wrapReactive(get(), true));
    });

    if (isDepReactive()) {
        proxy = createProxy(wrapReactive(value, true), {set, get});
        return proxy;
    }
    return {value};

    // // eslint-disable-next-line prefer-const
    // proxy = observe(() => {
    //     return createProxy(wrapReactive(get(), true), {set, get});
    // }, () => {
    //     // ! 每次都需要重新get以下 因为可能代码逻辑分支有变化导致出现了没有收集到的依赖
    //     proxy[util].forceWrite(wrapReactive(get(), true));
    // });
    // // console.log(proxy);
    // return proxy;
}