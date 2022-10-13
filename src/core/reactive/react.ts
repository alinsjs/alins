/*
 * @Author: tackchen
 * @Date: 2022-10-11 21:35:20
 * @Description: Coding something
 */

// import {IJson} from '../common';
import {IBuilderParameter} from '../core';

export const subscribe = Symbol('subscribe_react');

// type TBaseTypes = number | boolean | string | null | undefined;
// type TReactTypes = TBaseTypes | IJson<TReactTypes> | TReactTypes[];

export interface IReactItem<T = any> {
    set(v: T): void;
    get(): T;
    [subscribe](fn: (v:T, old:T) => void):  T;
}

export interface IReactObjectItem<T = any, K = string>{
    del(key: K): void;
    get(key: K): T[keyof T];
    set(key: K, value: T[keyof T]): void;
    set(v: T): void;
    get(): T;
    // get(key: K): any;
    // set(key: K, value: any): void;
    // set(v: object): void;
    // get(): object;
    [subscribe](fn: (v:T, old:T) => void): T;
}

interface IReactArray<T> extends IReactObjectItem<T, number> {

    length: number;

    pop(): T | undefined; // ! mod
    push(...items: T[]): number; // ! mod
    reverse(): T[]; // ! mod
    shift(): T | undefined; // ! mod
    unshift(...items: T[]): number; // ! mod
    sort(compareFn?: (a: T, b: T) => number): this; // ! mod

    concat(...items: ConcatArray<T>[]): T[];
    concat(...items: (T | ConcatArray<T>)[]): T[];

    join(separator?: string): string;

    
    slice(start?: number, end?: number): T[];

    splice(start: number, end: number): number;
    splice(start: number, deleteCount: number, ...items: T[]): T[];

    indexOf(searchElement: T, fromIndex?: number): number;
    lastIndexOf(searchElement: T, fromIndex?: number): number;
    every<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): this is S[];
    every(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
    
    some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
}

export type IReactWrap<T> = T extends object ? ({
    [prop in (keyof T)]: IReactWrap<T[prop]>;
} & (
    T extends Array<any> ? IReactArray<T>: IReactObjectItem<T>
)): IReactItem<T>;

export interface IReactBindingTemplate {
    template: string[], // TemplateStringsArray
    reactions: IReactItem[],
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
    return {
        // todo 从div构建处传入上下文环境
        exe (context: IReactContext) {
            return {template, reactions, context}; // todo
        },
        type: 'react'
    };
}
// function createReactive<T extends object> (data: T): IReactWrap<T>;
// function createReactive<T extends TBaseTypes> (data: T): IReactItem<T>;
function createReactive<T> (data: T): IReactWrap<T> | IReactItem<T> {
    const type = typeof data;
    if (type !== 'object' || data === null) {
        // 值类型
        const changeList: Function[] = [];
        return {
            get () {return data;},
            set (v: any) {
                if (v === data) return;
                data = v;
                changeList.forEach(fn => {fn(v, data);});
            },
            [subscribe] (fn) {
                changeList.push(fn);
                return this.get();
            }
        } as IReactItem<T>;
    }
    for (const key in data) {
        const value = data[key];
        (data as any)[key] = createReactive(value);
    }

    reactiveObject(data);
    
    return data as IReactWrap<T>;
}

function reactiveObject<T> (data: T) {
    const changeList: Function[] = [];
    const target = data as any;
    Object.assign(target, {
        get (k?: number|string) {
            if (typeof k === 'undefined') return target;
            return target[k];
        },
        set (v: any, value?: T) {
            if (typeof value === 'undefined') {
                if (v === data) return;
                target = v;
                changeList.forEach(fn => {fn(v, data);});
            } else {
                data[k];
            }
        },
        del () {

        },
        [subscribe] (fn) {
            changeList.push(fn);
            return this.get();
        }
    } as IReactObjectItem<T>);
}

// function createReactiveObject<T> (data: T): IReactWrap<T> {
//     // use proxy

    
//     return data as IReactWrap<T>;
// }


// 生成响应数据绑定
export function react(ts: TemplateStringsArray, ...reactions: IReactItem[]): IReactBuilder;
// 初始化响应数据
export function react<T>(data: T): IReactWrap<T>;

export function react<T> (data: TemplateStringsArray | T, ...reactions: IReactItem[]): IReactBuilder | IReactWrap<T> {
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