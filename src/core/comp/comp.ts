/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:45:14
 * @Description: Coding something
 */

import {IControllerBuilder} from '../controller/controller';
import {IBuilderParameter} from '../core';
import {IComponentElement, IElement, IElementBuilder} from '../element/transform';

export type TCompBuilderArg = '';

export interface IComponent {
    (options?: {
        props: any;
        event?: any;
        slot?: any;
    }): IElement;
}

export type TCompArg = string; // props event slot
export interface IComponentBuilder extends IBuilderParameter {
    exe(): IElement;
    type: 'comp';
}
export interface ICompConstructor extends IControllerBuilder {
    (comp: IComponent, ...args: TCompBuilderArg[]): IComponentBuilder;
}

// const CompMap: Map<Function, IComponentElement> = new Map(); // 或者可以使用 func.toString md5

export const comp: ICompConstructor = (component, ...args) => {

    if (typeof component !== 'function') throw new Error('component must be a function');

    // const mapValue = CompMap.get(el);
    // if (mapValue) return mapValue;


    // CompMap.set(el, comp);

    return {
        exe () {
            return component();
        },
        type: 'comp',
    };
};