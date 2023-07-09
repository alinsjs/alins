/*
 * @Author: tackchen
 * @Date: 2022-10-13 07:33:15
 * @Description: Coding something
 */

import {
    AlinsType,
    IJson, IOnChange, IProxyData, IProxyListener, IProxyListenerMap,
    IProxyUtils,
    isSimpleValue,
    type, util
} from 'alins-utils';
import {arrayFuncProxy} from './array-proxy';
import {replaceArrayItem} from './array-proxy';
import {empty} from 'packages/utils/src';

let currentFn: any = null;
let depReactive = false; // 当前表达式是否依赖响应数据

export function isDepReactive () {
    return depReactive;
}

export function observe (fn: ()=>any, listener: IProxyListener = fn) {
    // if (__DEBUG__) console.log('Start observe', fn, listener);
    currentFn = listener;
    depReactive = false;
    const v = fn();
    currentFn = null;
    return v;
}

export function isRef (data: any): boolean {
    return data?.[type] === AlinsType.Ref;
}

export function isProxy (data: any): boolean {
    const t = data?.[type];
    return t === AlinsType.Proxy || t === AlinsType.Ref;
}

export function wrapReactive (data: any, force = false) {
    if (force || !data || typeof data !== 'object') {
        return {value: data, [type]: AlinsType.Ref};
    }
    return data;
}

function replaceProxy (v: any, data: any) {
    debugger;
    const keys = new Set(Object.keys(data));
    for (const k in v) {
        const oldData = data[k];
        const newData = v[k];
        keys.delete(k);
        if (isSimpleValue(oldData) || isSimpleValue(newData) || data[util].shallow) {
            data[k] = newData;
            continue;
        }
        replaceProxy(newData, oldData);
    }
    keys.forEach((k) => {
        delete data[k];
    });
}

export function createUtils (
    data: IProxyData<object>,
    commonLns,
    lns: IProxyListenerMap,
    key: string,
    path: string[],
    shallow: boolean,
): IProxyUtils {
    const current = key ? [...path, key] : [...path];
    const isArray = Array.isArray(data);
    const triggerChange = (property: string, nv: any, old: any, remove?: boolean, isNew?: boolean) => {
        const each = fn => {
            fn(nv, old, `${current.join('.')}.${property}`, property, remove);
        };
        if (isNew) data[util].commonLns?.forEach(each);
        lns[property]?.forEach(each);
    };
    const forceUpdate = () => {
        for (const k in data)
            triggerChange(k, data[k], data[k]);
    };
    const replace = (v: any) => {
        replaceProxy(v, data[util].proxy);
    };
    const forceWrite = (v: any) => {
        for (const k in v)
            triggerChange(k, v[k], data[k]);
        Object.assign(data, v);
    };
    const subscribe = (ln: IProxyListener<any>, deep: boolean = true) => {
        // console.trace('subscribe', Object.keys(lns));
        data[util].commonLns?.add(ln) || (data[util].commonLns = new Set([ln]));
        for (const k in data) {
            lns[k]?.add(ln) || (lns[k] = new Set([ln]));
            if (deep && isProxy(data[k])) data[k][util].subscribe(ln, deep);
        }
    };
    if (commonLns) {
        lns[key] = new Set();
        commonLns.forEach(item => {lns[key].add(item);});
    }
    return {
        path: current,
        shallow,
        lns,
        triggerChange,
        forceWrite,
        subscribe,
        isArray,
        forceUpdate,
        replace,
    };
}

export function createProxy<T extends IJson> (data: T, {
    commonLns,
    lns = {}, // lns=>listeners
    shallow = false,
    set,
    get,
    path = [],
    key = '',
}: {
    lns?: IProxyListenerMap;
    shallow?: boolean;
    get?: ()=>any,
    set?: IOnChange<any>|null;
    path?: string[];
    key?: string;
    commonLns?: Set<IProxyListener>
} = {}): IProxyData<T> {

    // @ts-ignore
    if (!data[type]) data[type] = AlinsType.Proxy;

    if (!shallow) {
        for (const k in data) {
            const v = data[k];
            if (v && typeof v === 'object') {
                data[k] = createProxy(v, {path, key: k});
            }
        }
    }

    // @ts-ignore
    const {
        triggerChange, isArray
    } = data[util] = createUtils(data, commonLns, lns, key, path, shallow);
    const proxy = new Proxy(data, {
        get (target: IJson, property, receiver) {
            const isFunc = typeof target[property] === 'function';
            if (isArray && isFunc) {
                console.log('Proxy function', property, target[property]);
                // debugger;
                return arrayFuncProxy(target, property as string, receiver);
            }
            if (typeof property !== 'symbol' && !isFunc) {
                // ! 收集依赖
                if (currentFn) {
                    if (!depReactive) depReactive = true;
                    // if (__DEBUG__) console.log('收集依赖', property);
                    lns[property]?.add(currentFn) || (lns[property] = new Set([currentFn]));
                    // if (__DEBUG__) console.log('收集依赖222', lns[property]);
                    // ! 当在依赖搜集时 返回缓存的值
                    return Reflect.get(target, property, receiver);
                }
                // if (__DEBUG__) console.log('Proxy.get', target, property);
                if (get) return get();
            }
            return Reflect.get(target, property, receiver);
        },
        set (target: IJson, property, v, receiver) {
            if (typeof property !== 'symbol' && typeof target[property] !== 'function') {
                console.log('Proxy.set', target, property, v);
                const origin = target[property];
                
                if (v === origin) return true;
                if (set === null) { console.warn('Computed 不可设置'); return true;}
                if (set) { set(v, origin, `${path.join('.')}.${property as string}`, property); return true; }

                if (v && typeof v === 'object' && !shallow) { // ! 非shallow时 赋值需要createProxy并且将listener透传下去
                    // debugger;
                    v = createProxy(v, {
                        commonLns: target[util].commonLns,
                        lns: origin?.[util].lns,
                        shallow,
                        path,
                        key: property as string,
                    });
                }

                let value: any = empty;

                if (isArray && /^\d+$/.test(property)) {
                    debugger;
                    const data = replaceArrayItem(target, property, v, receiver);
                    if (data !== empty) value = data;
                }
                if (value === empty) value = Reflect.set(target, property, v, receiver);
                // ! 执行依赖
                // if (origin === undefined && property === '5') debugger;
                triggerChange(property as string, v, origin, false, typeof origin === 'undefined');
                return value;
            }
            return Reflect.set(target, property, v, receiver);
        },
        deleteProperty (target: IJson, property) {
            console.log('deleteProperty', target, property);
            triggerChange(property as string, undefined, target[property], true);
            return Reflect.deleteProperty(target, property);
        }
    }) as IProxyData<T>;
    data[util].proxy = proxy;
    return proxy;
}