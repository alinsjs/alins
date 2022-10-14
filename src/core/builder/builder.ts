/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:32:24
 * @Description: Coding something
 */

import {controllers, IControllerBuilder} from '../controller/controller';
import {IBuilderParameter} from '../core';
import {createElement, IElementBuilder, IElementOptions} from '../element/transform';
import {IReactBuilder} from '../reactive/react';

export type TBuilderArg = string | IBuilderParameter | (IElementBuilder|IElementBuilder[])[];

export interface IBuilderConstructor {
    (...args: TBuilderArg[]): IElementBuilder;
}

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
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (typeof item === 'string') {
            // dom info
            elementOptions.domInfo = item;
        } else if (item instanceof Array) {
            // append children
            elementOptions.children = item;
        } else if (typeof item === 'object') {
            switch (item.type) {
                case 'react': elementOptions.binding = (item as IReactBuilder).exe({
                    type: 'dom-info',
                }); break;
            }
        }
    }
    return createElement(elementOptions);
};
 
export const div = Object.assign(((...data) => {
    return () => {
        return elementBuilder('div', data);
    };
}) as IBuilderConstructor, controllers) as IBuilder;
