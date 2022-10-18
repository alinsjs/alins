/*
 * @Author: tackchen
 * @Date: 2022-10-11 21:35:20
 * @Description: react data
 */

import {IJson} from '../common';
import {IBuilderParameter} from '../core';
import {join} from '../utils';
import {Compute, computed, TComputedFunc, IComputedItem} from './computed';
import {createProxy} from './proxy';

export const subscribe = Symbol('subscribe_react');
export const forceUpdate = Symbol('force_update_react');
export const index = Symbol('index_react');
export const reactValue = Symbol('react_value');
export type TBaseTypes = number | boolean | string | null | undefined;
// type TReactTypes = TBaseTypes | IJson<TReactTypes> | TReactTypes[];

export interface IReactBase<T = any> {
    [index]?: IReactItem<number>;
    [forceUpdate](): void;
    [subscribe](fn: (v:T, old:T) => void):  T;
}
export interface IReactItem<T = any> extends IReactBase<T>{
    value: T;
    [reactValue]: boolean;
}

export type IReactWrap<T> = T extends object ? ({
    [prop in (keyof T)]: IReactWrap<T[prop]>;
} & IJson & (
    IReactBase<T>
)): IReactItem<T>;

export interface IReactBindingTemplate {
    template: string[], // TemplateStringsArray
    reactions: TReactionItem[] | any[],
}

// react上下文环境
export interface IReactContext {
    type: 'dom-info',
}; // todo

export interface IReactBinding extends IReactBindingTemplate {
    context: IReactContext; // todo
}
export interface IReactBuilder extends IBuilderParameter {
    type: 'react';
    exe(context: IReactContext): IReactBinding;
}

function bindReactive ({
    template,
    reactions,
}: IReactBindingTemplate): IReactBuilder {
    // console.log('bindReactive', template, reactions);
    debugger;
    return {
        // todo 从div构建处传入上下文环境
        exe (context: IReactContext) {
            debugger;
            return {template, reactions, context}; // todo
        },
        type: 'react'
    };
}
// export function createReactive<T extends object> (data: T): IReactWrap<T>;
// export function createReactive<T extends TBaseTypes> (data: T): IReactItem<T>;
export function createReactive<T> (data: T): IReactWrap<T> {
    const type = typeof data;
    if (type !== 'object' || data === null) {
        // 值类型
        return reactiveValue(data) as IReactWrap<T>;
    }

    if (typeof data === 'object') {
        return createProxy(data) as IReactWrap<T>;
    }
    
    throw new Error('createReactive error');
}

export function reactiveValue<T> (value: T): IReactItem<T> {
    const changeList: Function[] = [];
    return {
        get value () {
            Compute.add?.(this);
            return value;
        },
        set value (v: any) {
            if (v instanceof Array) v = v.join('\n');
            if (v === value) return;
            const old = value;
            value = v;
            changeList.forEach(fn => {fn(v, old);});
        },
        [reactValue]: true,
        [subscribe] (fn) {
            changeList.push(fn);
            return this.value;
        },
        [forceUpdate] () {
            changeList.forEach(fn => {fn(value, value);});
        }
    };
}

export type TReactionItem<T=any> = IReactItem<T> | TComputedFunc<T> | IComputedItem<T>;

// 生成响应数据绑定
export function react(ts: TemplateStringsArray, ...reactions: TReactionItem[]): IReactBuilder;
// 初始化响应数据
export function react<T>(data: T): IReactWrap<T>;

export function react<T> (
    data: TemplateStringsArray | T,
    ...reactions: TReactionItem[]
): IReactBuilder | IReactWrap<T> | IReactItem<T> {
    // todo check is TemplateStringsArray
    if (data instanceof Array && (data as any).raw instanceof Array) {
        return bindReactive({
            template: data as unknown as string[],
            reactions,
        });
    } else {
        return createReactive<T>(data as T);
    }
}

export function transformToReaction<T> (item: TReactionItem<T>): IReactItem<T> | IComputedItem<T> {
    return (typeof item === 'function') ? computed(item) : item;
}
export function countReaction (item: TReactionItem) {
    return (typeof item === 'function') ? item() : item.value;
}
export function countBindingValue (binding: IReactBinding) {
    return join(binding.template, binding.reactions.map(r => countReaction(r)));
}