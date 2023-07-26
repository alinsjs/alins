/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 15:31:14
 * @Description: Coding something
 */
import {IProxyListener, IProxyData, util, IRefData, trig} from 'alins-utils';
import {isProxy} from './proxy';
import {computed} from './computed';
import {IOprationAction} from './array-proxy';

export type IWatchRefTarget<T> = (()=>T)|IRefData<T>|{v:T};
export type IWatchTarget<T> = IWatchRefTarget<T>|(IProxyData<T>);

export function watchRef<T> (
    target: IWatchRefTarget<T>,
    cb: IProxyListener<T>,
): IRefData<T>|{v:T} {
    return watch(target, cb, false) as any;
}

export function watch<T> (
    target: IWatchTarget<T>,
    cb: IProxyListener<T>,
    deep = true,
): IProxyData<T>|IRefData<T>|{v:T} {
    if (typeof target === 'function') {
        target = computed(target);
        // 防止多次重复触发watch
        const origin = cb;
        let value: any;
        cb = (v, nv, path, p, remove) => {if (value !== v) origin(value = v, nv, path, p, remove);};
    } else if (!isProxy(target)) {
        // ! 兼容computed(()=>1+1)情况
        return target;
    }
    (target as IRefData<T>)[util].subscribe(cb, deep);
    return target;
};

export function watchArray (
    target: IProxyData<any[]>,
    listener: ({index, count, data, type}: IOprationAction)=>void
) {
    if (!target[trig]) {
        target[trig] = [listener];
    } else {
        target[trig].push(listener);
    }
}

// window.watchArray = watchArray;