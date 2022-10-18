/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:16:59
 * @Description: Coding something
 */
import {transformBuilderToDom, TChild} from './element/transform';
// import {delay} from './utils';

export function mount (...builders: (string | Element | TChild)[]) {
    let parent: Element | string | null = builders[0] as any;
    if (typeof parent === 'string') {
        parent = document.querySelector(parent);
        if (!(parent instanceof Element)) throw new Error('Parent is not defined');
    }
    
    if (parent instanceof HTMLElement) {builders.shift();}
    else parent = document.body;

    for (let i = 0; i < builders.length; i++) {
        mountSingleChild(parent as HTMLElement, builders[i] as TChild);
    }
}

function mountSingleChild (parent: HTMLElement, child: TChild) {
    if (child instanceof Array) {
        for (let i = 0; i < child.length; i++) {
            mountSingleChild(parent, child[i]);
        }
    } else {
        if (child.type === 'builder' || child.type === 'comp') {
            parent.appendChild(transformBuilderToDom(child));
        } else {
            parent.appendChild(child.exe(parent));
        }
    }
}

// export async function batchMountDom (dom: HTMLElement, doms: HTMLElement[]) {
//     let index = 0;
//     const once = 1000;

//     while (index < doms.length) {
//         appendChildren(dom, doms.slice(index, index + once));
//         index += once;
//         // await delay();
//     }
//     console.timeLog('mounted');
// }
// function appendChildren (dom: HTMLElement, doms: HTMLElement[]) {
//     const frag = document.createDocumentFragment();
//     doms.forEach(item => {
//         frag.appendChild(item);
//     });
//     dom.appendChild(frag);
// }

// export function mountXDom (container: IElement, el: IElement) {
    
// }