/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:31:56
 * @Description: Coding something
 */
import {addEvent, isEventAttr, IEventNames} from './event';
import {IElement, IFragment, ITrueElement, Renderer} from './renderer';
import {
    reactiveBinding, IBindingReactionEnable, reactiveBindingEnable,
    reactiveClass, IChildren,
} from './dom-util';
import {IJson} from 'alins-utils';
import {IBindingReaction, IBindingRef} from 'alins-reactive';
import {IAttributes} from './jsx';

export type IAttributeNames = keyof IAttributes;

// type IClassReaction = {
//     [a in string]: a extends '$value' ? IBindingReaction : IBindingRef<boolean>;
// }
type IClassReaction = {
    $value?: IBindingReaction
} & IJson<IBindingRef<boolean>|IBindingReaction>

export interface IJSXDomOptions {
    tag?: string;
    // type: DomType;
    isText?: boolean;
    jsx?: boolean;
    // $html?: IBindingReaction;
    text?: IBindingReaction;
    // html?: IBindingReaction;
    children?: (IChildren|IJSXDomOptions)[];
    attributes?: null | ({
        class?: IBindingReaction | IClassReaction;
    } & {
        [prop in IEventNames]?: (e: Event) => void;
    } & {
        [prop2 in IAttributeNames]?: IBindingReactionEnable;
    } & {
        [prop in string]: any;
    })
//   $life?: any; // todo
}

export function transformOptionsToElement (opt: IJSXDomOptions): ITrueElement {
    let el: ITrueElement;
    if (opt.isText) {
        el = Renderer.createTextNode('');
        if (opt.text !== '') {
            // @ts-ignore
            el.textContent = reactiveBinding(opt.text, (v) => {
                // console.warn('reactiveBinding trigger', el, el.textContent, v);
                el.textContent = v;
            });
        }
    } else {
        const isDom = !!opt.tag;
        el = isDom ? Renderer.createElement(opt.tag as string) : Renderer.createDocumentFragment();
        // if (opt.html) {
        //     // @ts-ignore
        //     el.innerHTML = reactiveBinding(opt.html, (v) => {el.innerHTML = v;});
        // } else
        if (opt.children) {
            appendChildren(el, opt.children);
        }

        // // 生命周期
        // if (opt.$life) {
        //     // todo
        //     delete opt.$life;
        // }
        if (isDom) {
            for (const k in opt.attributes) {
                const v = opt.attributes[k];
                if (isEventAttr(el as IElement, k, v)) {
                    addEvent(el as IElement, k, v);
                    continue;
                }
    
                if (k === 'class') {
                    // @ts-ignore
                    el.className = reactiveClass(v, (key, value) => {
                        el = el as IElement;
                        // console.log(key, value);
                        if (!key) el.className = value;
                        else !!value ? el.classList.add(key) : el.classList.remove(key);
                    });
                } else {
                    const value = reactiveBindingEnable(v, (v) => {
                        el = el as IElement;
                        el.setAttribute(k, v);
                    }, (bool) => {
                        el = el as IElement;
                        bool ? el.setAttribute(k, v) : el.removeAttribute(k);
                    });
                    // debugger;
                    // console.warn('reactiveBindingEnable', k, value);
                    // @ts-ignore
                    el.setAttribute(k, value);
                }
            }
        }
    }
    return el;
}

export function appendChildren (parent: IElement|IFragment, children: (IChildren|IJSXDomOptions)[]) {
    for (const item of children) {
        if (typeof item === 'undefined' || item === null) continue;

        if (Renderer.isElement(item)) {
            parent.appendChild(item as any);
            continue;
        }

        let options: any = null;
        if (isJSXElement(item)) {
            // @ts-ignore 是 domOptions
            options = item;
        } else {
            options = {text: item, isText: true};
        }
        
        const dom = transformOptionsToElement(options);
        // @ts-ignore
        parent.appendChild(dom);
    }
}

export function isJSXElement (item: any) {
    return typeof item === 'object' && item.jsx === true;
}

export const JSX = {
    createElement (
        tag: string | ((options: IJSXDomOptions)=>ITrueElement|Promise<ITrueElement>),
        attributes: any = null,
        ...children: any[]
    ): ITrueElement {
        if (typeof tag === 'function') {
            const result: IJSXDomOptions = {attributes, children, jsx: true};
            // console.log('createComponent', result);
            const dom = tag(result);
            // if (dom.toString() === '[object Promise]') {
            return transformAsyncDom(dom) as any;
        }
        const result: IJSXDomOptions = {tag, attributes, children, jsx: true};
        // console.log('createElement', result);
        return transformOptionsToElement(result);
    }
};

export function transformAsyncDom (
    dom: ITrueElement|Promise<ITrueElement>|null|void,
    returned = true,
    onRealDom?: (trueDom: any)=>void,
) {
    if (!dom) return dom;
    if (dom instanceof Promise) {
        // ! returned 表示 async 有返回值
        if (returned === false) return void 0;
        // ! 此处是为了应对 元素没有立即append到dom上的情况
        const frag = Renderer.createDocumentFragment();
        const node = Renderer.createEmptyMountNode();
        frag.appendChild(node as any);
        dom.then((realDom: any) => {
            if (!Renderer.isElement(realDom)) return;
            const parent = node.parentElement || frag;
            // ! 此处当async node被隐藏时 async执行完毕 此处会报错
            try {
                parent.insertBefore(realDom, node);
            } catch (e) {
                console.log('node 已被隐藏');
            } finally {
                onRealDom?.(realDom);
                node.remove();
            }
        });
        return frag;
    }
    return dom;
}