/*
 * @Author: chenzhongsheng
 * @Date: 2022-10-29 22:44:44
 * @Description: Coding something
 */

export function removeDom (dom: HTMLElement) {
    dom.remove();
    triggerDomEvent('removed', dom);
}

export function appendFragment (parent: HTMLElement, frag: DocumentFragment) {
    const children = getFragChild(frag);
    parent.appendChild(frag);
    children.forEach(triggerAppend);
}

export function onDomEvent (name: string, dom: any, fn?: Function) {
    if (!fn) return;
    name = `__alins_on_${name}`;
    if (!dom[name]) dom[name] = [];
    dom[name].push(fn);
}

export function triggerDomEvent (name: string, dom: any) {
    const attr = `__alins_on_${name}`;
    if (dom[attr]) {
        dom[attr].forEach((fn:any) => {fn(dom);});
        if (name === 'mounted') { // ! mounted 只会挂在一次
            dom[attr] = null;
        }
    }
}

function triggerAppend (child: Node|HTMLElement) {
    triggerDomEvent('appended', child);
    triggerDomEvent('mounted', child);
}

export function insertBefore (parent: HTMLElement, child: Node|HTMLElement|DocumentFragment, traget: HTMLElement) {
    const children = child instanceof DocumentFragment ? getFragChild(child) : null;
    parent.insertBefore(child, traget);
    if (children) {
        children.forEach(triggerAppend);
    } else {
        triggerAppend(child);
    }
}

function getFragChild (frag: DocumentFragment) {
    return [].slice.call(frag.children) as HTMLElement[];
}

