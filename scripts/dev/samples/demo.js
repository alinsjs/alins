/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-06 18:17:22
 * @Description: Coding something
 */
const d = { list: [] };

d.list = createProxy(d.list);

const p = createProxy(d);


d.a = 1;

function createProxy (d) {
    return new Proxy(d, {
        // ! 闭包
        get (target, property, receiver) {
            console.log('get', target, property, target[property]);
            return Reflect.get(target, property, receiver);
        },
        // ! 闭包
        set (target, property, v, receiver) {
            console.log('set', property, target[property]);
            return Reflect.set(target, property, v, receiver);
        },
        // ! 闭包
        deleteProperty (target, property) {
            console.log('deleteProperty', property, target[property]);
            return Reflect.deleteProperty(target, property);
        }
    });
}