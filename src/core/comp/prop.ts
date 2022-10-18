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
                const prop = props[k];
                const computeTarget = typeof prop === 'function' ? prop : () => prop.value;
                data[k] = computed(computeTarget);
            }
            return data;
        }
    };

};