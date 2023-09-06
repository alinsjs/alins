/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-06 18:16:44
 * @Description: Coding something
 */

const d = { list: [] };

d.list = createProxy(d.list);

const p = createProxy(d);

d.a = 1;

function createProxy (data, {}) {
    return new Proxy(data, {
        get (target, property, receiver) {

            if (typeof property === 'symbol') return target[property];

            console.log('get', target, property, target[property]);
            return Reflect.get(target, property, receiver);
        },
        set (target, property, v, receiver) {
            console.log('set', property, target[property]);
            return Reflect.set(target, property, v, receiver);
        },
        deleteProperty (target, property) {
            console.log('deleteProperty', property, target[property]);
            return Reflect.deleteProperty(target, property);
        }
    });
}