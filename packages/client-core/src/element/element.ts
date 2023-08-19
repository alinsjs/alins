/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:31:56
 * @Description: Coding something
 */
import {addEvent, isEventAttr, IEventNames} from './event';
import {IElement, IFragment, ITrueElement, Renderer} from './renderer';
import {
    IBindingReactionEnable, reactiveBindingEnable,
    IChildren, reactiveBindingValue,
} from './dom-util';
import {IJson} from 'alins-utils';
import {IBindingReaction, IBindingRef, isProxy} from 'alins-reactive';
import {IAttributes} from './jsx';
import {parseStyle} from './style';
import {parseModel} from './model';
import {getParent} from '../utils';
import {parseAttributes} from './attributes';
import {parseClassName} from './class';
import {initMutationObserver} from './mutation-observer';

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
            reactiveBindingValue(opt.text, (v) => {
                // console.warn('reactiveBinding trigger', el, el.textContent, v);
            // @ts-ignore
                el.textContent = v;
            });
        }
    } else {
        const isDom = !!opt.tag;
        el = isDom ? Renderer.createElement(opt.tag as string) : Renderer.createDocumentFragment();
        // if (opt.html) {
        //     // @ts-ignore
        //     reactiveBindingValue(opt.html, (v) => {el.innerHTML = v;});
        // } else
        if (opt.children && opt.children.length > 0) {
            if (opt.attributes?.$html) {
                console.warn('$html 属性的元素的子元素将失效');
            } else {
                appendChildren(el, opt.children);
            }
        }

        // // 生命周期
        // if (opt.$life) {
        //     // todo
        //     delete opt.$life;
        // }
        if (isDom && opt.attributes) {

            // @ts-ignore
            const $appended = opt.attributes.$appended;

            for (const k in opt.attributes) {
                const v = opt.attributes[k];
                if (isEventAttr(el as IElement, k, v)) {
                    addEvent(el as IElement, k, v);
                    continue;
                }
                if (k === '$created') {
                    v(el);
                } else if (k === '$appended') {
                    // @ts-ignore
                    el.__$appended = $appended;
                    continue;
                } else if (k === '$removed') {
                    // @ts-ignore
                    el.__$removed = v;
                } else if (k === '$mounted') {
                    // @ts-ignore
                    el.__$mounted = v;
                } else if (k === '$parent') {
                    let dom = v;
                    if (typeof dom === 'string') {
                        // @ts-ignore
                        dom = document.querySelector(dom);
                    }
                    if (!dom) throw new Error('$parent is not a Element');
                    dom.appendChild(el);
                    // todo 此处有可能还没有append到document中
                    if ($appended) $appended(el);
                } else if (k === '$html') {
                    reactiveBindingEnable(v, (v) => {
                        // @ts-ignore
                        el.innerHTML = v || '';
                    });
                } else if (k === '$attributes') {
                    // @ts-ignore
                    parseAttributes(el, v);
                } else if (k === '$show') {
                    // @ts-ignore
                    reactiveBindingEnable(v, (v) => {
                        // @ts-ignore
                        el.style.display = v ? '' : 'none';
                    });
                } else if (k === 'class') {
                    // @ts-ignore
                    parseClassName(el, v);
                } else {
                    // @ts-ignore
                    if (k === 'style' && parseStyle(el as HTMLElement, v)) continue;
                    // @ts-ignore
                    else if (parseModel(el as HTMLElement, v, k)) continue;
                    reactiveBindingEnable(v, (v) => {
                        debugger;
                        // @ts-ignore
                        v === null ? el.removeAttribute(k) : el.setAttribute(k, v);
                    });
                }
            }
        }
    }
    
    return el;
}

export function appendChildren (parent: IElement|IFragment, children: (IChildren|IJSXDomOptions)[]) {
    for (const item of children) {
        if (typeof item === 'undefined' || item === null) continue;

        if (Array.isArray(item)) {
            appendChildren(parent, item);
            return;
        }

        if (Renderer.isElement(item)) {
            if (item.__$mounted || item.__$removed) {
                initMutationObserver(parent);
            }
            parent.appendChild(item as any);
            item.__$appended?.(item);
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
        tag: string | ((
            attributes: IAttributes|null, children: ITrueElement[]
        )=>ITrueElement|Promise<ITrueElement>),
        attributes: IAttributes|null = null,
        ...children: any[]
    ): ITrueElement {
        if (typeof tag === 'function') {
            let $parent: any = null;
            if (attributes) {
                $parent = attributes.$parent;
                delete attributes.$parent;
                // console.log('createComponent', result);
                for (const k in attributes) {
                    const v = attributes[k];
                    if (!isProxy(v)) {
                        attributes[k] = {v};
                    }
                    // if(typeof v === 'function')
                }
            }

            const dom = tag(attributes, children);
            // if (dom.toString() === '[object Promise]') {
            const result = transformAsyncDom(dom) as any;
            if ($parent) {
                $parent.appendChild(result);
            }
            return result;
        }
        // @ts-ignore
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
            const parent = getParent(node, frag);
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