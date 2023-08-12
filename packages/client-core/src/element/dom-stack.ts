/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-12 01:09:10
 * @Description: Coding something
 */
const stack: any[] = [];

let currentDom: any = null;

export function onStartCreateDom (el: any) {
    currentDom = el;
    stack.push(el);
}

export function onDomCreated () {
    currentDom = stack.pop();
}

export function collectDomClearFn (fn: any) {
    if (!currentDom) return;

    if (!currentDom.__clear_list) currentDom.__clear_list = [];

    currentDom.__clear_list.push(fn);
}

export function onDomRemove (el: any) {
    const list = el.__clear_list;
    if (!list) return;
    for (const fn of list) {
        fn();
    }
}