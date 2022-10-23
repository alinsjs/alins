/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:32:24
 * @Description: Coding something
 */

import {controllers, IControllerBuilder} from '../controller/controller';
import {IEventBuilder} from '../event/on';
import {createElement, IElement, IElementBuilder, IElementOptions, TChild} from '../element/transform';
import {countBindingValue} from 'alins-reactive';
import {IReactBinding, IReactBuilder} from 'alins-utils/src/types/react.d';

export type TBuilderArg = number | string | IReactBuilder | IEventBuilder | TChild | IBuildFunction; // (IElementBuilder|IElementBuilder[])[];

export type IBuildFunction = () => TBuilderArg[];
export interface IBuilder extends IControllerBuilder, IBuilderConstructor {
    // todo controller
}

function getTagNameFromDomInfo (domInfo: string) {
    if (domInfo[0] !== '/') return '';
    for (let i = 1; i < domInfo.length; i++) {
        if ('.#[:'.includes(domInfo[i])) return domInfo.substring(1, i);
    }
    return domInfo.substring(1);
}

/**
 * dom builder 是div等函数的返回值
 * 在执行mount的时候的会动态的执行 返回一个 IElement对象
 * 然后通过 transform 方法转正真实dom节点
 */
function elementBuilder (tag: string, data: TBuilderArg[]) {
    // console.log('elementBuilder', tag, data, JSON.stringify(data));
    const elementOptions: IElementOptions & {
        children: TChild[],
        binding: IReactBinding[],
    } = {
        tag,
        children: [],
        event: [],
        binding: [],
        styles: [],
        domInfo: ''
    };
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (typeof item === 'string') {
            // dom info
            const tagName = getTagNameFromDomInfo(item);
            if (tagName) elementOptions.tag = tagName;
            elementOptions.domInfo += item;
        } else if (item instanceof Array) {
            // append children
            elementOptions.children.push(item);
        } else if (typeof item === 'object' && item) {
            switch (item.type) {
                case 'react':
                    const binding = item.exe({type: 'dom-info'});
                    if (binding.template[0][0] === '/') {
                        const domInfo = countBindingValue(binding);
                        elementOptions.tag = getTagNameFromDomInfo(domInfo);
                    }
                    elementOptions.binding.push(binding); // todo maybe other binding
                    break;
                case 'builder':
                case 'if':
                case 'show':
                case 'model':
                case 'switch':
                case 'for':
                case 'comp':
                    elementOptions.children.push(item); break;
                case 'on':
                    elementOptions.event?.push(item); break;
                case 'style':
                    elementOptions.styles?.push(item); break;
                default: console.warn('unkonwn builder', item); break;
            }
        } else if (typeof item === 'function') {
            data.push(...item());
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
export const img = buildFactory('img');
export const a = buildFactory('a');
export const i = buildFactory('i');
export const text = (v: string) => ':' + v;
// todo add element

function createBaseBuilder (exe: ()=> IElement): IElementBuilder {
    return {
        exe,
        type: 'builder',
    };
}