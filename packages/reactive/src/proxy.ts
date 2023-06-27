/*
 * @Author: tackchen
 * @Date: 2022-10-13 07:33:15
 * @Description: Coding something
 */

import {
    AlinsType,
    IJson, IProxyData, IProxyListener, IProxyListenerMap,
    IProxyUtils,
    type, util
} from 'alins-utils';

let currentFn: any = null;

export function observe (fn: ()=>any, listener = fn) {
    console.log('Start observe', fn, listener);
    currentFn = listener;
    const v = fn();
    currentFn = null;
    return v;
}

export function isRef (data: any): boolean {
    return data?.[type] === AlinsType.Ref;
}

export function isProxy (data: any): boolean {
    return !!data?.[util];
}

export function wrapReactive (data: any) {
    if (!data || typeof data !== 'object') {
        return {value: data, [type]: AlinsType.Ref};
    }
    data[type] = AlinsType.Proxy;
    return data;
}

export function createUtils (data: any, lns: IProxyListenerMap, path: string): IProxyUtils {
    const triggerChange = (property: string, nv: any, old: any = null) => {
        lns[property]?.forEach((fn) => fn(nv, old, `${path}.${property}`));
    };
    const forceWrite = (v: any) => {
        for (const k in v)
            triggerChange(k, v[k], data[k]);
        Object.assign(data, v);
    };
    const subscribe = (ln: IProxyListener, deep: boolean = true) => {
        console.log('subscribe', Object.keys(lns));
        for (const k in data) {
            lns[k]?.add(ln) || (lns[k] = new Set([ln]));
            if (deep && isProxy(data[k])) {
                data[k][util].subscribe(ln, deep);
            }
        }
    };
    return {
        lns,
        triggerChange,
        forceWrite,
        subscribe,
    };
}

export function createProxy<T extends IJson> (data: T, {
    lns = {}, // lns=>listeners
    shallow = false,
    set,
    get,
    path = '',
}: {
    lns?: IProxyListenerMap;
    shallow?: boolean;
    get?: ()=>any,
    set?: ((v: any, old: any, path: string) => void)|null;
    path?: string;
} = {}): IProxyData<T> {

    if (!shallow) {
        for (const k in data) {
            const v = data[k];
            if (v && typeof v === 'object') {
                data[k] = createProxy(v);
            }
        }
    }

    // @ts-ignore
    const {triggerChange} = data[util] = createUtils(data, lns, path);

    return new Proxy(data, {
        get (target: IJson, property, receiver) {
            if (typeof property !== 'symbol' && typeof target[property] !== 'function') {
                // ! 收集依赖
                if (currentFn) {
                    console.log('收集依赖', property);
                    lns[property]?.add(currentFn) || (lns[property] = new Set([currentFn]));
                    console.log('收集依赖222', lns[property]);
                    // ! 当在依赖搜集时 返回缓存的值
                    return Reflect.get(target, property, receiver);
                }
                console.log('Proxy.get', target, property);
                if (get) return get();
            }
            return Reflect.get(target, property, receiver);
        },
        set (target: IJson, property, v, receiver) {
            const origin = target[property];
            if (set === null) {
                console.warn('Computed 不可设置');
                return true;
            } else if (set) {
                set(v, origin, `${path}.${property as string}`);
                return true;
            }
            if (v && typeof v === 'object' && !shallow) { // 非shallow时 赋值需要createProxy并且将listener透传下去
                v = createProxy(v, {lns: origin[util].lns, shallow, path: `${path}.${property as string}`});
            }
            const value = Reflect.set(target, property, v, receiver);
            // ! 执行依赖
            triggerChange(property as string, v, origin);
            return value;
        },
        deleteProperty (target: IJson, property) {
            console.log('deleteProperty', target, property);
            return Reflect.deleteProperty(target, property);
        }
    }) as IProxyData<T>;
}