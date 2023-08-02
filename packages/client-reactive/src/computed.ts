/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 11:18:42
 * @Description: Coding something
 */

import {util, IRefData, IOnChange} from 'alins-utils';
import {observe, createProxy, wrapReactive} from './proxy';
import {isDepReactive} from './proxy';

export interface IComputedObject<T> {
    get(): T;
    set?: IOnChange<T>;
}

// ! computed 都为ref，且都是shallow
export function computed<T> (target:(()=>T)|IComputedObject<T>): IRefData<T>|{v: T} {
    const isFunc = typeof target === 'function';
    const get = isFunc ? target : target.get;
    const set = isFunc ? null : (target as IComputedObject<T>).set;

    let proxy: IRefData<T>;

    const v = observe(get, () => {
        // console.log('warn observe', JSON.stringify(proxy));
        // ! 每次都需要重新get一下 因为可能代码逻辑分支有变化导致出现了没有收集到的依赖
        proxy[util].forceWrite(wrapReactive(get(), true));
    });

    if (isDepReactive()) {
        proxy = createProxy(wrapReactive(v, true), {set, get});
        return proxy;
    }
    // ! 此处是为了兼容编译时将未知类型的import常量进行表达式计算时进行的统一computed处理的开销
    // 也可以优化 computed静态类型的开销 如 computed(()=>1+1)
    return {v};

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