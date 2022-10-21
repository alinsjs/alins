/*
 * @Author: tackchen
 * @Date: 2022-10-17 21:58:28
 * @Description: Coding something
 */

import {IJson} from '../common';
import {IBuilderParameter} from '../core';
import {TChild} from '../element/transform';

export type TSlotFunction = (...args: any[]) => TChild;

export type TSlotElement = IJson<TChild | TSlotFunction> | TChild | TSlotFunction;

export interface ISlot extends IBuilderParameter {
    type: 'slot';
    exe(): TSlotElement;
}

export  interface ISlotConstructor {
    (slot: IJson<TChild | TSlotFunction> | TChild | TSlotFunction): ISlot;
}

export const slot: ISlotConstructor = (slot) => {
    return {
        type: 'slot',
        exe: () => slot,
    };
};