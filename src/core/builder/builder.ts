/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:32:24
 * @Description: Coding something
 */

import {IJson} from '../common';
import {IBindBuilder} from '../controller/bind';
import {controllers, IControllerBuilder} from '../controller/controller';
import {IIfBuilder} from '../controller/if';
import {IShowBuilder} from '../controller/show';
import {ISwitchBuilder} from '../controller/switch';
import {IBuilderParameter} from '../core';
import {IEventBuilder} from '../event/event';
import {createElement, IElement, IElementBuilder, IElementOptions, TChild} from '../element/transform';
import {IReactBuilder} from '../reactive/react';

export type TBuilderArg = number | string | IReactBuilder | IEventBuilder | TChild; // (IElementBuilder|IElementBuilder[])[];

export interface IBuilder extends IControllerBuilder, IBuilderConstructor {
    // todo controller
}

/**
 * dom builder 是div等函数的返回值
 * 在执行mount的时候的会动态的执行 返回一个 IElement对象
 * 然后通过 transform 方法转正真实dom节点
 */
function elementBuilder (tag: string, data: TBuilderArg[]) {
    // console.log('elementBuilder', tag, data, JSON.stringify(data));
    const elementOptions: IElementOptions = {tag};
    elementOptions.children = [];
    elementOptions.events = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (typeof item === 'string') {
            // dom info
            elementOptions.domInfo = item;
        } else if (item instanceof Array) {
            // append children
            elementOptions.children.push(item);
        } else if (typeof item === 'object') {
            switch (item.type) {
                case 'react': elementOptions.binding = item.exe({
                    type: 'dom-info',
                }); break;
                case 'builder':
                case 'if':
                case 'show':
                case 'bind':
                case 'switch':
                    elementOptions.children.push(item); break;
                case 'event':
                    elementOptions.events?.push(item); break;
            }
        }
    }
    // console.count('createElement');
    return createElement(elementOptions);
};

// export const getBuilderId = (() => {
//     const map: IJson<number> = {};
//     return (name: string) => {
//         if(map)
//     };
// })();


export interface IBuilderConstructor extends IControllerBuilder {
    (...args: TBuilderArg[]): IElementBuilder;
}

export function buildFactory (tag: string): IBuilderConstructor {
    return Object.assign(((...data: TBuilderArg[]) => {
        // todo exe add context
        return createBaseBuilder(() => {
            return elementBuilder(tag, data);
        });
    }), controllers);
}

export const dom = buildFactory;
 
export const div = buildFactory('div');
export const span = buildFactory('span');
export const input = buildFactory('input');
export const button = buildFactory('button');
// todo add element

function createBaseBuilder (exe: ()=> IElement): IElementBuilder {
    return {
        exe,
        type: 'builder',
    };
}