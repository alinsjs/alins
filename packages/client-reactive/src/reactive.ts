/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 11:00:45
 * @Description: Coding something
 */

import {
    IJson,
    IProxyData,
} from 'alins-utils';
import { createProxy, isProxy, wrapReactive } from './proxy';

export function reactive<T extends IJson> (data: T, shallow = false): IProxyData<T> {
    if (isProxy(data.v)) return data as any;
    // @ts-ignore
    return createProxy<T>(wrapReactive(data) as T, { shallow });
}

export function ref<T> (v: T, shallow?: boolean) {
    if (typeof shallow !== 'boolean') {
        // @ts-ignore
        shallow = typeof v?.v === 'object' && isProxy(v.v);
    }
    return reactive<{v: T}>({ v }, shallow);
}
