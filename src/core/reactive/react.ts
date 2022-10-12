/*
 * @Author: tackchen
 * @Date: 2022-10-11 21:35:20
 * @Description: Coding something
 */

import {IBuilderParameter} from '../core';

export interface IReactItem {
    set(v: any): void;
    get(): any;
    onchange(fn: (v:any, old:any) => void): void;
}

export interface IReactData extends IReactItem {
}

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
    exe(context: IReactContext): IReactBinding;
    type: 'react';
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

function createReactive (data: any): IReactData {
    const type = typeof data;
    if (type === 'number' || type === 'string' || type === 'boolean') {
        // 值类型
        const changeList: Function[] = [];
        return {
            get () {return data;},
            set (v: any) {
                changeList.forEach(fn => {fn(v, data);});
            },
            onchange (fn) {
                changeList.push(fn);
            }
        };
    }
    return data as IReactData; // todo
}
// 生成响应数据绑定
export function react(ts: TemplateStringsArray, ...reactions: IReactItem[]): IReactBuilder;
// 初始化响应数据
export function react(data: any): IReactData;

export function react (data: TemplateStringsArray | any, ...reactions: IReactItem[]): IReactBuilder | IReactData {

    // todo check is TemplateStringsArray
    if (data instanceof Array && (data as any).raw instanceof Array) {
        return bindReactive({
            template: data,
            reactions,
        });
    } else {
        return createReactive(data);
    }
}