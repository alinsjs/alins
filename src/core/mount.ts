/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:16:59
 * @Description: Coding something
 */
import {transformBuilderToDom, IElementBuilder} from './element/transform';
// import {delay} from './utils';

export function mount (container: string, builder: IElementBuilder) {
    // const dom = document.createElement('div');
    // document.querySelector(container)?.appendChild(dom);
    // transformBuilderToDom(builder, dom);
    document.querySelector(container)?.appendChild(
        transformBuilderToDom(builder),
    );
    // console.timeLog('mounted');
    // debugger;
    
    // document.querySelector(container)?.appendChild(dom);
    // console.timeLog('mounted');
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