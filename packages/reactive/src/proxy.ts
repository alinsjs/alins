/*
 * @Author: tackchen
 * @Date: 2022-10-13 07:33:15
 * @Description: Coding something
 */

import {
    forceUpdate, subscribe, reactValue,
    value, getListeners, updateFirstLevel, json
} from 'alins-utils';
import {IJson} from 'alins-utils/src/types/common.d';
import {IReactObject} from 'alins-utils/src/types/react.d';
import {
    reactiveValue,  isReaction,
    getReactionPureValue, mergeReact, reactiveProxyValue
} from './react';

// 1. emptyValue // 使用 isUndefined 函数解决
// 2. change value 参数问题 getReactionPureValue
// 3. switchListeners 深度遍历问题

export function createProxy<T extends IJson> (
    originData: T,
    firstLevel = true,
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
            changeList[i](newValue, oldValue, index);
        }
    };

    // ! assign react properties
    Object.assign(data, {
        [subscribe] (fn: any) {
            changeList.push(fn);
            return data;
        },
        [forceUpdate] () {
            triggerChange(data, data);
        },
        [reactValue]: false,
        [updateFirstLevel]: () => {
            firstLevel = false;
        },
        [getListeners]: () => changeList,
        get [json] () { return getReactionPureValue(data);}
    });

    return new Proxy(data, {
        get (target: IJson, property, receiver) {
            if (property === value) return data;
            const type = typeof data[property];
            if (!(Array.isArray(target) && (property === 'length' || type === 'function'))) {
                if (type === 'undefined' && property !== 'toJSON') {
                    data[property] = reactiveValue('', true);
                }
            }
            return Reflect.get(target, property, receiver);
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
                    if (firstLevel) {
                        console.warn('不能对一级对象设置value属性');
                        return true;
                    }
                }
                return set();
            }

            const oldValue = target[property];
            if (isReaction(v)) { // ! 当值是reaction时不需要代理直接设置
                // todo 监听
                // 直接设置
                v[updateFirstLevel](); // ! 这一步是为了去掉 旧数据的firstLevel
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