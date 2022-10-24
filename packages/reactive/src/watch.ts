/*
 * @Author: tackchen
 * @Date: 2022-10-18 10:11:33
 * @Description: Coding something
 */
import {IReactItem, IComputedItem} from 'alins-utils/src/types/react.d';
import {subscribe} from 'alins-utils';
import {computed, TComputedBuilder} from './computed';

export type TWatchCallback<T> = (v: T, old: T) => void;

export function watch<T> (
    target: IReactItem<T> | IComputedItem<T> | TComputedBuilder<T>,
    cb: TWatchCallback<T>
): void {
    if (!(target as any)[subscribe]) {
        target = computed(target as TComputedBuilder<T>);
    }
    target[subscribe](cb);
};
