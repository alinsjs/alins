/*
 * @Author: tackchen
 * @Date: 2022-10-24 00:30:56
 * @Description: Coding something
 */
const a = {
    a: 1,
};

let monitor = [];

const p = new Proxy(a, {
    get (target, property, receiver) {
        monitor.push({target, property});
        return Reflect.get(target, property, receiver);
    },
    set (target, property, v, receiver) {
        return Reflect.set(target, property, v, receiver);
    }
});

function count (value) {
    console.log(monitor);
    monitor = [];
    return value + 2;
}

count(p.a + 1);