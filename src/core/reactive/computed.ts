/*
 * @Author: tackchen
 * @Date: 2022-10-17 08:45:21
 * @Description: Coding something
 */

import {createReactive, IReactItem, subscribe, TBaseTypes} from './react';

const ComputeWatcher = {
    add (item: IReactItem<any>) {
        item[subscribe]((v) => {
            
        });
    }
};

export const Compute: {
    instance: typeof ComputeWatcher | null;
    watch(fn: Function): any
} = {
    instance: null,
    watch (fn: Function): any {
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

export function computed<T> (fn: ()=> T) {

    const reacts: IReactItem[] = [];
    Compute.instance = {
        add (item: IReactItem<TBaseTypes>) {
            reacts.push(item);
        }
    };
    const react = createReactive(fn()) as IReactItem;
    Compute.instance = null;

    reacts.forEach(item => item[subscribe](() => {
        react.set(fn());
    }));

    return react;
}