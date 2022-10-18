import {IJson} from '../common';
import {IBuilderParameter} from '../core';
import {computed, IComputedItem} from '../reactive/computed';
import {TReactionItem} from '../reactive/react';

/*
 * @Author: tackchen
 * @Date: 2022-10-17 21:58:28
 * @Description: Coding something
 */


export interface IProp extends IBuilderParameter {
    type: 'prop';
    exe(): IJson<IComputedItem>;
}

export  interface IPropConstructor {
    (props: IJson<TReactionItem>): IProp;
}

export const prop: IPropConstructor = (props) => {
    return {
        type: 'prop',
        exe () {
            const data: IJson<IComputedItem> = {};
            for (const k in props) {
                const item = props[k];
                (window as any).item = item;
                const computeTarget = typeof item === 'function' ? item : (() => item.get());
                data[k] = computed(computeTarget);
            }
            return data;
        }
    };

};