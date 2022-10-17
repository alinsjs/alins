/*
 * @Author: tackchen
 * @Date: 2022-10-17 08:45:21
 * @Description: Coding something
 */

import {createReactive, IReactItem, subscribe} from './react';

const ComputeWatcher = {
    add (item: IReactItem<any>) {
        item[subscribe]((v) => {
            
        });
    }
};

export const Compute: {
    instance: typeof ComputeWatcher | null;
    watch(fn: Function): void
} = {
    instance: null,
    watch (fn: Function): void {
        this.instance = {
            add (item: IReactItem<any>) {
                item[subscribe]((v) => {
                    
                });
            }
        };
        const value = fn();
        this.instance = null;
        return value;
    }
};

export function computed (fn: ()=> any) {

    const value = Compute.watch(fn);

    return createReactive(value);
}