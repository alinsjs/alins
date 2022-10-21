/*
 * @Author: tackchen
 * @Date: 2022-10-17 21:58:28
 * @Description: Coding something
 */

import {IJson} from '../common';
import {IBuilderParameter} from '../core';
import {TElementChild} from '../element/transform';


export interface ISlot extends IBuilderParameter {
    type: 'slot';
    exe(): IJson<TElementChild>;
}

export  interface ISlotConstructor {
    (slot: IJson<TElementChild> | TElementChild): ISlot;
}

export const slot: ISlotConstructor = (slot) => {
    return {
        type: 'slot',
        exe () {
            if (typeof (slot as any).type === 'string' || slot instanceof Array) {
                return {
                    default: slot as TElementChild
                };
            }
            return slot as IJson<TElementChild>;
        }
    };
};