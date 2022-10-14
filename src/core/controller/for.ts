/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {TBuilderArg} from '../builder/builder';
import {IElementBuilder} from '../element/transform';
import {IReactWrap} from '../reactive/react';

export interface IForController {
    <T>(list: IReactWrap<T>[]): ((fn: IForCallback<T>) => IElementBuilder[]);
}

export interface IForCallback<T=any> {
    (item: IReactWrap<T>, index?: number): TBuilderArg[];
}

export const forController: IForController = function (this: IElementBuilder, list) {
    return (fn) => list.map((item, index) => this.call(null, ...fn(item, index)));
};