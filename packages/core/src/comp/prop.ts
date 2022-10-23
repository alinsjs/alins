/*
 * @Author: tackchen
 * @Date: 2022-10-17 21:58:28
 * @Description: Coding something
 */

import {IJson, IBuilderParameter} from 'alins-utils/src/types/common.d';
import {computed, isReaction} from 'alins-reactive';
import {IComputedItem, TReactionItem} from 'alins-utils/src/types/react.d';

export interface IProp extends IBuilderParameter {
    type: 'prop';
    exe(): IJson<IComputedItem>;
}

export  interface IPropConstructor {
    (prop: IJson<TReactionItem>): IProp;
}

export const prop: IPropConstructor = (prop) => {
    return {
        type: 'prop',
        exe () {
            const data: IJson<IComputedItem> = {};
            for (const k in prop) {
                const item = prop[k];
                (window as any).item = item;
                const computeTarget = typeof item === 'function' ? item :
                    (isReaction(item) ? () => item.value : () => item);
                data[k] = computed(computeTarget);
            }
            return data;
        }
    };
};