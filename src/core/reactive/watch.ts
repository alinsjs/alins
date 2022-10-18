/*
 * @Author: tackchen
 * @Date: 2022-10-18 10:11:33
 * @Description: Coding something
 */

import {computed, IComputedItem, TComputedBuilder} from './computed';
import {IReactItem, subscribe} from './react';

export type TWatchCallback<T> = (v: T, old: T) => void;

export function watch<T> (
    target: IReactItem<T> | IComputedItem<T> | TComputedBuilder<T>,
    cb: TWatchCallback<T>
): void {
    if (!(target as any)[subscribe]) {
        target = computed(target as TComputedBuilder<T>);
    }
    (target as IComputedItem<T>)[subscribe](cb);
};
