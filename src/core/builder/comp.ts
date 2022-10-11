/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:45:14
 * @Description: Coding something
 */

import {IComponentElement, IElement} from '../element/base';

export interface IComponent {
    (options?: {
        props: any;
        event?: any;
        slot?: any;
    }): IComponentElement | IElement;
}

export type TCompArg = string; // props event slot
export interface IComponentBuilder {
    (comp: IComponentElement, ...args: TCompArg[]): IComponentElement;
    // todo controller
}

const CompMap: Map<Function, IComponentElement> = new Map(); // 或者可以使用 func.toString md5

export const comp: IComponentBuilder = (...data) => {

    const el = data[0];
  
    if (typeof el !== 'function') throw new Error('');

    const mapValue = CompMap.get(el);
    if (mapValue) return mapValue;

    const comp: IComponentElement = { // todo
    };

    CompMap.set(el, comp);

    return comp;
};