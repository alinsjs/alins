/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 15:31:14
 * @Description: Coding something
 */
import {IProxyListener, IProxyData, util, IRefData} from 'alins-utils';
import {computed} from './computed';

export function watch<T> (
    target: (()=>T)|(IProxyData<T>)|IRefData<T>,
    cb: IProxyListener,
    deep = true,
): IProxyData<T>|IRefData<T> {
    if (typeof target === 'function') {
        target = computed(target);
        // 防止多次重复触发watch
        const origin = cb;
        let value: any;
        cb = (v, nv, path) => {if (value !== v) origin(value = v, nv, path);};
    }
    target[util].subscribe(cb, deep);
    return target;
};