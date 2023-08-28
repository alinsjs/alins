import {Renderer} from './element/renderer';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-04 09:52:35
 * @Description: Coding something
 */
export function createEmptyJson () {
    const json = {};
    // @ts-ignore
    json.__proto__ = null;
    return json;
}

export function getParent (node: any, def: any = null) {
    return node.parentElement || node.parentNode || def;
}

export function insertBefore (array: any[], node: any, child: any) {
    const index = array.indexOf(child);
    if (index === -1) throw new Error('insertBefore error');

    if (Renderer.isFragment(node)) {
        debugger;
        node = Array.from(node.childNodes);
    } else {
        node = [node];
    }
    if (index === 0) {
        array.unshift(...node);
    } else {
        array.splice(index - 1, 0, ...node);
    }
}