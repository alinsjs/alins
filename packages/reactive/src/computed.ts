/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 11:18:42
 * @Description: Coding something
 */

import {util, IProxyData} from 'alins-utils';
import {observe, createProxy, wrapReactive} from './proxy';

export interface IComputedObject<T> {
    get(): T;
    set?: ((v: T, old: T, path: string) => void);
}

export function computed<T> (target:(()=>T)|IComputedObject<T>): IProxyData<T> {
    const isFunc = typeof target === 'function';
    const get = isFunc ? target : target.get;
    const set = isFunc ? null : (target as IComputedObject<T>).set;

    let proxy: IProxyData<T>;

    // eslint-disable-next-line prefer-const
    proxy = observe(() => {
        return createProxy(wrapReactive(get()), {set, get});
    }, () => {
        proxy[util].forceWrite(wrapReactive(get()));
    });
    // console.log(proxy);
    return proxy;
}