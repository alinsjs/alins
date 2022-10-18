/*
 * @Author: tackchen
 * @Date: 2022-10-13 07:33:15
 * @Description: Coding something
 */

import {IJson} from '../common';
import {forceUpdate, subscribe, IReactBase} from './react';


export function createProxy<T extends IJson> (
    data: T, changeList: Function[] = []
): IReactBase<T> {

    if (typeof data === 'object') {
        for (const key in data) {
            const value = data[key];
            if (typeof value === 'object' && value !== null) {
                (data as any)[key] = createProxy(value);
            }
        }
    }

    const triggerChange = (value: any, oldValue: any) => {
        for (let i = 0; i < changeList.length; i++) {
            changeList[i](value, oldValue);
        }
    };

    const p = new Proxy(data, {
        get (target: IJson, property, receiver) {
            if (!(Array.isArray(target) && (property === 'length' || typeof (target as any)[property] === 'function'))) {
                console.log('Proxy.get', target, property, receiver);
            }
            return Reflect.get(target, property, receiver);
        },
        set (target: IJson, property, value, receiver) {
            const oldValue = (target as any)[property];
            if (value === oldValue) return false;

            if (!(Array.isArray(target) && property === 'length')) {
                triggerChange(value, oldValue);
                if (typeof value === 'object') value = createProxy(value, []);
                const type = typeof (target as any)[property] === 'undefined' ? 'create' : 'modify';

                console.log('Proxy.set', type, target, property, value);
            }
            return Reflect.set(target, property, value, receiver);
        },
        deleteProperty (target: IJson, property) {
            console.log('delete', {target, property});
            triggerChange(undefined, target[property]);
            return Reflect.deleteProperty(target, property);
        }
    }) as any;
    p[subscribe] = (fn: any) => {
        changeList.push(fn);
        return data;
    };
    p[forceUpdate] = () => {
        triggerChange(data, data);
    };
    return p;
}


// const p = createProxy({
//     a: 1,
//     b: {b: 1},
//     c: [1, 2],
//     d: {d: [1, 2, 3]},
//     e: [{e: 1}],
// });
// (window as any).createProxy = createProxy;
// (window as any).p = p;
