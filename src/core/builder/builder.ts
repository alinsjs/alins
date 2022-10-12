/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:32:24
 * @Description: Coding something
 */

import {IBuilderParameter} from '../core';
import {createElement, IElementBuilder, IElementOptions} from '../element/transform';
import {parseDomInfo} from '../parser/info-parser';
import {IReactBuilder} from '../reactive/react';

export type TBuilderArg = string | IBuilderParameter | IElementBuilder[];

export interface IBuilder {
    (...args: TBuilderArg[]): IElementBuilder;
    // todo controller
}

function elementBuilder (tag: string, data: TBuilderArg[]) {
    const elementOptions: IElementOptions = {tag};
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (typeof item === 'string') {
            // dom info
            Object.assign(elementOptions, parseDomInfo(item));
        } else if (item instanceof Array) {
            // append children
            elementOptions.children = item;
        } else if (typeof item === 'object') {
            switch (item.type) {
                case 'react': elementOptions.reaction = (item as IReactBuilder).exe({
                    type: 'dom-info',
                }); break;
            }
        }
    }
    return createElement(elementOptions);
};
 
export const div: IBuilder = (...data) => {
    return () => {
        return elementBuilder('div', data);
    };
};