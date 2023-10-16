/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-18 23:47:24
 * @Description: Coding something
 */
import type { IRefData } from 'alins-utils';
import { computed } from './computed';
import { isProxy } from './proxy';
import { ref } from './reactive';

export function assignData (...data: any[]) {
    return assignBase(data, false);
}

export function assignCompData (...data: any[]) {
    return assignBase(data, true);
}

function assignBase (data: any[], isComp: boolean) {
    data.forEach((item, index) => {
        if (isProxy(item)) {
            const newData = {};
            for (const k in item) {
                newData[k] = () => item[k];
                if (isComp) {
                    newData[k] = computed(newData[k]);
                }
            }
            data[index] = newData;
        }
    });
    // @ts-ignore
    return Object.assign.apply(null, data);
}

// 解构reactive支持 ！需要编译时配合将解构出来的对象全部加上 .v
export function deconstruct<T extends Record<string|number, any>> (
    data: {v:T},
    readonly = true
): {
    [prop in keyof T]: IRefData<T[prop]>
} {
    // @ts-ignore
    if (!isProxy(data)) return data;
    const isArray = Array.isArray(data.v);
    const result: any = isArray ? [] : {};
    for (const k in data) {
        result[k] = computed(readonly ? (() => data.v[k]) : {
            get: () => data.v[k],
            // @ts-ignore
            set: (v: any) => {data.v[k] = v;}
        });
    }
    return result;
}

export function createStateScope<
    T extends Record<string, any>
> (state: T): {
    [prop in keyof T]: T[prop] extends Function ? {v: T[prop]}: IRefData[T[prop]]
} {
    const result = {} as any;
    for (const k in state) {
        if (typeof state[k] === 'function') {
            result[k] = { v: state[k].bind(state) };
        } else if (isProxy(state[k])) {
            result[k] = state[k];
        } else {
            result[k] = ref(state[k]);
        }
    }
    return result;
}