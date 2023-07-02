/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 15:31:14
 * @Description: Coding something
 */
import {IProxyListener, IProxyData, util, IRefData} from 'alins-utils';
import {isProxy} from './proxy';
import {computed} from './computed';

export type IWatchRefTarget<T> = (()=>T)|IRefData<T>|{value:T};
export type IWatchTarget<T> = IWatchRefTarget<T>|(IProxyData<T>);

export function watchRef<T> (
    target: IWatchRefTarget<T>,
    cb: IProxyListener<T>,
): IRefData<T>|{value:T} {
    return watch(target, cb, false) as any;
}

export function watch<T> (
    target: IWatchTarget<T>,
    cb: IProxyListener<T>,
    deep = true,
): IProxyData<T>|IRefData<T>|{value:T} {
    if (typeof target === 'function') {
        target = computed(target);
        // 防止多次重复触发watch
        const origin = cb;
        let value: any;
        cb = (v, nv, path) => {if (value !== v) origin(value = v, nv, path);};
    } else if (!isProxy(target)) {
        // ! 兼容computed(()=>1+1)情况
        return target;
    }
    (target as IRefData<T>)[util].subscribe(cb, deep);
    return target;
};