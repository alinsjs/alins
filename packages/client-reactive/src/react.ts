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

// ! 重载顺序不能更改
// 生成响应数据绑定
export function react(ts: TemplateStringsArray, ...reactions: any[]): any[];
// 初始化响应数据
export function react<T>(data: T): IProxyData<T>;
// // es6兼容写法
// export function react(data: string, ...reactions: (TReactionItem | string)[]): IReactBuilder;

export function react<T extends IJson> (
    data: TemplateStringsArray | T | string,
    ...reactions: any[]
) {
    if (isStringTemplateArray(data)) {
        // console.log(data, reactions);
        const result: any[] = [];
        for (let i = 0; i < reactions.length; i++)
            result.push(data[i], reactions[i]);
        return result;
    }
    return createProxy<T>(wrapReactive(data) as T);
}

export function reactive<T extends IJson> (data: T, shallow = false): IProxyData<T> {

    if (isProxy(data.v)) return data as any;
    // @ts-ignore
    return createProxy<T>(wrapReactive(data) as T, { shallow });
}

function isStringTemplateArray (data: any) {
    return data instanceof Array && (data as any).raw instanceof Array;
}
