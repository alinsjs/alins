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
    (slots: IJson<TElementChild> | TElementChild): ISlot;
}

export const slot: ISlotConstructor = (slots) => {
    return {
        type: 'slot',
        exe () {
            if (typeof (slots as any).type === 'string' || slots instanceof Array) {
                return {
                    default: slots as TElementChild
                };
            }
            return slots as IJson<TElementChild>;
        }
    };
};