/*
 * @Author: tackchen
 * @Date: 2022-10-13 07:33:15
 * @Description: Coding something
 */

import {
    forceUpdate, subscribe, reactValue,
    value, getListeners, json, index,
    IJson, IReactObject
} from 'alins-utils';
import {
    reactiveValue,  isReaction,
    getReactionPureValue, mergeReact, reactiveProxyValue
} from './react';

// 1. emptyValue // 使用 isUndefined 函数解决
// 2. change value 参数问题 getReactionPureValue
// 3. switchListeners 深度遍历问题

// function getJson (data:any) { return data?.[json] ? data[json]() : data; };

export function createProxy<T extends IJson> (
    originData: T,
    changeList: Function[] = [],
): IReactObject<T> {

    const data = originData as any;

    if (typeof data === 'object') {
        for (const key in data) {
            if (key === 'toJSON') break;
            data[key] = reactiveProxyValue(data[key]);
        }
    }

    const triggerChange = (newValue: any, oldValue: any, index?: number) => {
        // value = getReactionPureValue(value);
        // oldValue = getReactionPureValue(oldValue);
        // debugger;
        // console.log(newValue, oldValue);
        for (let i = 0; i < changeList.length; i++) {
            changeList[i]((newValue), (oldValue), index);
            // todo
            // changeList[i](getJson(newValue), getJson(oldValue), index);
        }
    };

    // ! assign react properties
    Object.assign(data, {
        [subscribe] (fn: any) {
            changeList.push(fn);
            return data;
        },
        [forceUpdate] (old = data, index: number) {
            triggerChange(data, old, index);
        },
        [reactValue]: false,
        [getListeners]: () => changeList,
        [json]: () => {
            return getReactionPureValue(data);
        }
    });

    return new Proxy(data, {
        get (target: IJson, property, receiver) {
            if (property === value) return getReactionPureValue(data);
            const type = typeof data[property];
            if (!(Array.isArray(target) && (property === 'length' || type === 'function'))) {
                if (type === 'undefined' && property !== 'toJSON') {
                    data[property] = reactiveValue('', true);
                }
            }
            return Reflect.get(target, property, receiver);
            // const result = Reflect.get(target, property, receiver);
            // if (result[reactValue] === false) return result[value];
            // return result;
        },
        set (target: IJson, property, v, receiver) {
            const isArray = target instanceof Array;
            const isSymbol = typeof property === 'symbol';
            // if (isArray && !isSymbol && /^\d+$/.test(property as string)) debugger;
            const parseIndex = () => (isArray && !isSymbol && /^\d+$/.test(property as string)) ? parseInt(property as string) : -1;
            const set = () => {
                return Reflect.set(target, property, v, receiver);
            };
            if (isArray) {
                if (property === 'length') return set();// 数组的length属性
                const oldIndex = target.indexOf(v);
                if (oldIndex !== -1) { // 数组类型的内部元素位置变更
                    // todo 监听
                    const index = parseIndex();
                    triggerChange(v, target[index], index);
                    target[oldIndex] = undefined;
                    return set();
                }
            }

            if (isSymbol) {
                if (property === value) {
                    const old = data[json]();
                    // console.warn('不能对一级对象设置value属性');
                    if (isArray) {
                        const vLen = typeof v === 'undefined' ? 0 : v.length;
                        // target.splice(0, target.length, ...v);
                        for (let i = 0; i < vLen; i++) {
                            const old = target[i];
                            const newValue = reactiveProxyValue(v[i]);
                            newValue[index] = reactiveValue(i); // ! index
                            if (old) mergeReact(old, newValue, i);
                            triggerChange(newValue, old, i);
                            target[i] = newValue;
                        }
                        if (target.length > vLen) {
                            const arr = target.splice(vLen, target.length - vLen);
                            for (let i = 0; i < arr.length; i++) {
                                triggerChange(undefined, arr[i], i + vLen);
                            }
                        }
                    } else {
                        if (isReaction(v)) {
                            v = v[json]();
                        }
                        const isUndf = typeof v === 'undefined';
                        for (const k in target) {
                            if (isUndf || !(k in v)) {
                                const old = target[k];
                                delete target[k];
                                old[old[reactValue] ? 'value' : value] = undefined;
                                triggerChange(undefined, old);
                            }
                        }
                        if (!isUndf) {
                            for (const k in v) {
                                const old = target[k];
                                const reaction = reactiveProxyValue(v[k]);
                                mergeReact(old, reaction);
                                target[k] = reaction;
                            }
                        }
                    }
                    triggerChange(data[json](), old);
                    return true;
                } else if (property === json) {
                    console.warn('json symbol 属性不可设置');
                    return true;
                }
                return set();
            }

            const oldValue = target[property];
            if (isReaction(v)) { // ! 当值是reaction时不需要代理直接设置
                // 直接设置
                triggerChange(v, oldValue);
                return set();
            }
            const isOldValueUnd = typeof oldValue === 'undefined';
            if (isOldValueUnd) {
                // ! 新创建的属性或元素做一下reactive处理
                v = reactiveProxyValue(v);
                triggerChange(v, oldValue, parseIndex());
            } else {
                // 如果值一样则不设置
                // ! 对reaction值的设置转移到 value 属性上来
                if (oldValue[reactValue]) {
                    target = oldValue;
                    property = 'value';
                } else {
                    v = reactiveProxyValue(v);
                    if (isArray) {
                        const index = parseIndex();
                        triggerChange(v, target[index], index);
                    } else {
                        mergeReact(oldValue, v);
                    }
                }
            }
            return set();
        },
        deleteProperty (target: IJson, property) {
            if (target instanceof Array) {
                const index = (typeof property === 'string' && /^\d+$/.test(property as string)) ? parseInt(property as string) : -1;
                triggerChange(undefined, target[index], index);
            } else {
                triggerChange(undefined, target[property]);
            }
            return Reflect.deleteProperty(target, property);
        }
    }) as any;
}