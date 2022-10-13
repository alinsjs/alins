/*
 * @Author: tackchen
 * @Date: 2022-10-13 07:33:15
 * @Description: Coding something
 */
export const subscribe = Symbol('subscribe_react');

export function createProxy<T extends object> (data: T) {

    if (typeof data === 'object') {
        for (const key in data) {
            const value = data[key];
            if (typeof value === 'object' && value !== null) {
                data[key] = createProxy(value);
            }
        }
    }

    const changeList: Function[] = [];
    return new Proxy(data, {
        get (target, property, receiver) {
            if (!(Array.isArray(target) && (property === 'length' || typeof (target as any)[property] === 'function'))) {
                console.log('Proxy.get', target, property, receiver);
            }
            return Reflect.get(target, property, receiver);
        },
        set (target, property, value, receiver) {
            const old = target[property];
            if (value === old) return false;

            changeList.forEach(fn => {fn(value, old);});
            if (typeof value === 'object') value = createProxy(value);
            const type = typeof (target as any)[property] === 'undefined' ? 'create' : 'modify';

            if (!(Array.isArray(target) && property === 'length')) {
                console.log('Proxy.set', type, target, property, value);
            }
            return Reflect.set(target, property, value, receiver);
        },
        deleteProperty (target, property) {
            console.log('delete', {target, property});
            return Reflect.deleteProperty(target, property);
        }
    });
}


const p = createProxy({
    a: 1,
    b: {b: 1},
    c: [1, 2],
    d: {d: [1, 2, 3]},
    e: [{e: 1}],
});
(window as any).createProxy = createProxy;
(window as any).p = p;
