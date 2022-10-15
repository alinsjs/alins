/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:32:24
 * @Description: Coding something
 */

import {IJson} from '../common';
import {controllers, IControllerBuilder} from '../controller/controller';
import {IBuilderParameter} from '../core';
import {createElement, IElement, IElementBuilder, IElementOptions} from '../element/transform';
import {IReactBuilder} from '../reactive/react';

export type TBuilderArg = string | IReactBuilder | IElementBuilder | IElementBuilder[]; // (IElementBuilder|IElementBuilder[])[];


export interface IBuilder extends IControllerBuilder, IBuilderConstructor {
    // todo controller
}

/**
 * dom builder 是div等函数的返回值
 * 在执行mount的时候的会动态的执行 返回一个 IElement对象
 * 然后通过 transform 方法转正真实dom节点
 */
function elementBuilder (tag: string, data: TBuilderArg[]) {
    const elementOptions: IElementOptions = {tag};
    elementOptions.children = [];
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
                case 'builder': elementOptions.children.push(item); break;
            }
        }
    }
    return createElement(elementOptions);
};

// export const getBuilderId = (() => {
//     const map: IJson<number> = {};
//     return (name: string) => {
//         if(map)
//     };
// })();

const datas :any[] = [];

export interface IBuilderConstructor extends IControllerBuilder {
    (...args: TBuilderArg[]): IElementBuilder;
}
 
export const div = ((...data) => {
    // todo exe add context
    return createBaseBuilder(() => {
        datas.push(data); // debug
        return elementBuilder('div', data);
    });
}) as IBuilderConstructor;

Object.assign(div, controllers);

function createBaseBuilder (exe: ()=> IElement): IElementBuilder {
    return {
        exe,
        type: 'builder',
    };
}