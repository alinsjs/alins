/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 11:00:45
 * @Description: Coding something
 */

import {
    IJson,
    IProxyData,
    isStringTemplateArray,
} from 'alins-utils';
import {createProxy, wrapReactive} from './proxy';
import {createBinding, IBindingReaction, IReactBindingResult} from './binding';


// ! 重载顺序不能更改
// 生成响应数据绑定
export function react(ts: TemplateStringsArray, ...reactions: (IBindingReaction)[]): string|IReactBindingResult;
// 初始化响应数据
export function react<T>(data: T): IProxyData<T>;
// // es6兼容写法
// export function react(data: string, ...reactions: (TReactionItem | string)[]): IReactBuilder;

export function react<T extends IJson> (
    data: TemplateStringsArray | T | string,
    ...reactions: (IBindingReaction)[]
) {
    if (isStringTemplateArray(data)) {
        // console.log(data, reactions);
        return createBinding(data as any as string[], reactions);
    }
    return createProxy<T>(wrapReactive(data) as T);
}

export function reactive<T extends IJson> (data: T, shallow = false): IProxyData<T> {
    return createProxy<T>(wrapReactive(data) as T, {shallow});
}