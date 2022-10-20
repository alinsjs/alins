/*
 * @Author: tackchen
 * @Date: 2022-10-13 07:33:15
 * @Description: Coding something
 */

import {IJson} from '../common';
import {
    forceUpdate, subscribe, reactiveValue, reactValue,
    isSimpleValue, IReactObject, value, getListeners,
    IReactBase, switchReact, isReaction,
    emptyValue, getReactionValue, getReactionPureValue, json, mergeReact, reactiveProxyValue
} from './react';

// todo 1. emptyValue // 使用 isUndefined 函数解决
// 2. change value 参数问题 getReactionPureValue
// 3. switchListeners 深度遍历问题

export function createProxy<T extends IJson> (
    originData: T,
    firstLevel = true,
    setValue?: (v: any)=>void,
    changeList: Function[] = [],
): IReactObject<T> {

    const data = originData as any;

    if (typeof data === 'object') {
        for (const key in data) {
            if (key === 'toJSON') break;
            data[key] = reactiveProxyValue(data[key], (v: any) => {
                // debugger;
                data[key] = v;
            });
        }
    }

    const triggerChange = (value: any, oldValue: any, index?: number) => {
        // value = getReactionPureValue(value);
        // oldValue = getReactionPureValue(oldValue);
        // debugger;
        for (let i = 0; i < changeList.length; i++) {
            changeList[i](value, oldValue, index);
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
        [switchReact]: (target: IReactBase<any>, property: string) => {
            console.warn('appendToReact', data, target, property);
            firstLevel = false;
            // switchListeners(data, target, property);
        },
        [getListeners]: () => changeList,
        get [json] () { return getReactionPureValue(data);}
    });

    // get [value] () {
    //     debugger;
    //     return data;
    // },
    // set [value] (v: any) {
    //     debugger;
    //     const newValue = reactiveProxyValue(v, setValue);
    //     console.warn('newValue', newValue);
    //     console.warn('data', data);
    //     triggerChange(newValue, data);
    //     setValue?.(newValue);
    // },
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
                if (target.includes(v)) { // 数组类型的内部元素位置变更
                    // todo 监听
                    const index = parseIndex();
                    triggerChange(v, target[index], index);
                    return set();
                }
            }

            if (isSymbol) {
                if (property === value) {
                    if (firstLevel) {
                        console.warn('不能对一级对象设置value属性');
                        return true;
                    } else {
                        // const oldValue = getReactionPureValue(data);
                        const oldValue = data;
                        // todo 需要reactive ？
                        v = reactiveProxyValue(v, setValue);
                        mergeReact(data, v);
                        // todo
                        triggerChange(v, oldValue);
                    }
                    // return true;
                }
                return set();
            }

            const oldValue = target[property];
            if (isReaction(v)) { // ! 当值是reaction时不需要代理直接设置
                // todo 监听
                // 直接设置
                v[switchReact](target, property); // ! 这一步是为了去掉 旧数据的firstLevel
                triggerChange(v, oldValue);
                return set();
            }
            const isOldValueUnd = typeof oldValue === 'undefined';
            if (isOldValueUnd) {
                // ! 新创建的属性或元素做一下reactive处理
                v = reactiveProxyValue(v, (v) => {target[property] = v;});
                // switchListeners(v, target as any, property);
                triggerChange(v, oldValue, parseIndex());
            } else {
                // 如果值一样则不设置
                const trueValue = oldValue[subscribe] ? getReactionValue(oldValue) : oldValue;
                if (v === trueValue) return true;
                // ! 对reaction值的设置转移到 value 属性上来
                target = oldValue;
                property = (target[reactValue]) ? 'value' : value;
            }
            return set();
        },
        deleteProperty (target: IJson, property) {
            console.log('delete', {target, property});
            triggerChange(undefined, target[property]);
            // 释放内存
            (changeList as any) = null;
            (originData as any) = null;
            return Reflect.deleteProperty(target, property);
        }
    }) as any;
    
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
