/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 15:31:14
 * @Description: Coding something
 */
import {IProxyListener, IProxyData, utils} from './proxy';
import {computed} from './computed';

export function watch<T> (
    target: (()=>T)|(IProxyData<T>),
    cb: IProxyListener,
    deep = true,
): IProxyData<T> {
    if (typeof target === 'function') {
        target = computed(target);
    }
    target[util].subscribe(cb, deep);
    return target;
};