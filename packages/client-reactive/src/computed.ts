/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 11:18:42
 * @Description: Coding something
 */

import { util, IRefData, IOnChange } from 'alins-utils';
import { observe, createProxy, wrapReactive } from './proxy';
import { isDepReactive } from './proxy';

export interface IComputedObject<T> {
    get(): T;
    set?: IOnChange<T>;
}

// ! computed 都为ref，且都是shallow
export function computed<T> (target:(()=>T)|IComputedObject<T>, isProp = false): IRefData<T>|{v: T} {
    const isFunc = typeof target === 'function';
    // @ts-ignore
    const get = isFunc ? target : target.get;
    const set = isFunc ? null : (target as IComputedObject<T>).set;

    let proxy: IRefData<T>;

    let computing = false;
    let cache: any = null;
    const v = observe(get, () => {
        // console.log('warn observe', JSON.stringify(proxy));
        // ! 每次都需要重新get一下 因为可能代码逻辑分支有变化导致出现了没有收集到的依赖
        if (!computing) {
            computing = true;
            cache = proxy?.[util].forceWrite(get(), 'v');
            computing = false;
        } else {
            proxy?.[util].forceWrite(cache, 'v');
        }
        /**
! BAD CASE
let age = 0;
const age1 = age++;
<button onclick={age++} $$App>Add {age} {age1}</button>;
         */
    });
    cache = v;

    if (isDepReactive()) {
        // todo check return cache
        proxy = createProxy(wrapReactive(v, true), { set, get, isProp });
        return proxy;
    }
    // ! 此处是为了兼容编译时将未知类型的import常量进行表达式计算时进行的统一computed处理的开销
    // 也可以优化 computed静态类型的开销 如 computed(()=>1+1)
    return { v };
}

