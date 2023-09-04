/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:31:56
 * @Description: Coding something
 */
import { addEvent, isEventAttr, IEventNames } from './event';
import { IElement, IFragment, ITrueElement, Renderer } from './renderer';
import {
    IBindingReactionEnable, reactiveBindingEnable,
    IChildren, reactiveBindingValue,
} from './dom-util';
import { AlinsType, IJson, type } from 'alins-utils';
import { IBindingReaction, IBindingRef, isProxy } from 'alins-reactive';
import { IAttributes } from './jsx';
import { parseStyle, parseStyleSuffix } from './style';
import { parseModel } from './model';
import { getParent } from '../utils';
import { parseAttributes } from './attributes';
import { parseClassName, parseClassSuffix } from './class';
import { initMountedObserver, initRemovedObserver } from './lifecycle';

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
                // @ts-ignore
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

            let $mount: any = opt.attributes.$mount;

            opt.attributes.$created?.(el);

            for (const k in opt.attributes) {
                const v = opt.attributes[k];
                if (isEventAttr(el as IElement, k, v)) {
                    addEvent(el as IElement, k, v);
                    continue;
                }

                switch (k) {
                    case '$created': break;
                    case '$appended': (el as IElement).__$appended = $appended; break;
                    case '$removed': (el as IElement).__$removed = v; break;
                    case '$mounted': (el as IElement).__$mounted = v; break;
                    case '$mount': break;
                    case '$html': reactiveBindingEnable(v, (v) => {
                        // @ts-ignore
                        el.innerHTML = v || '';
                    }); break;
                    case '$ref': v(el); break;
                    case '$attributes': parseAttributes(el as any, v); break;
                    case '$show': reactiveBindingEnable(v, (v) => {
                        // @ts-ignore
                        el.style.display = v ? '' : 'none';
                    }); break;
                    case 'class': parseClassName(el as any, v); break;
                    default: {
                        if (
                            (k === 'style' && parseStyle(el as any, v)) ||
                            parseModel(el as any, v, k) ||
                            parseClassSuffix(el as any, k, v) ||
                            parseStyleSuffix(el as any, k, v)
                        ) {
                            break;
                        } else {
                            reactiveBindingEnable(v, (v) => {
                                if (typeof v === 'object') {
                                    v = (!!v.enable) ? v.value : null;
                                }
                                // @ts-ignore
                                v === null ? el.removeAttribute(k) : el.setAttribute(k, v);
                            });
                        }
                    }; break;
                };
            }
            if ($mount) {

                if (typeof $mount === 'string') $mount = document.querySelector($mount);
                if (!$mount) throw new Error('$mount is not a Element');
                // dom.appendChild(el);
                appendChild($mount, el);
                if ($appended) $appended(el); // todo 此处有可能还没有append到document中

            }

        }
    }
    return el;
}

function appendChild (parent: any, item: any) {
    // @ts-ignore
    if (item.__$mounted) {
        initMountedObserver(parent);
    }
    // @ts-ignore
    if (item.__$removed) initRemovedObserver(item);
    parent.appendChild(item as any);
    // @ts-ignore
    item.__$appended?.(item);
}


export function appendChildren (parent: IElement|IFragment, children: (IChildren|IJSXDomOptions)[]) {
    for (const item of children) {
        if (typeof item === 'undefined' || item === null) continue;

        if (Array.isArray(item)) {
            appendChildren(parent, item);
            return;
        }

        if (Renderer.isElement(item)) {
            appendChild(parent, item);
            continue;
        }

        let options: any = null;
        if (isJSXElement(item)) {
            // @ts-ignore 是 domOptions
            options = item;
        } else {
            options = { text: item, isText: true };
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
            let $mount: any = null;
            if (attributes) {
                $mount = attributes.$mount;
                delete attributes.$mount;
                // console.log('createComponent', result);
                for (const k in attributes) {
                    const v = attributes[k];
                    if (!isProxy(v)) {
                        attributes[k] = { v, [type]: AlinsType.Ref }; // ! 模拟ref
                    }
                    // if(typeof v === 'function')
                }
            }
            const dom = tag(attributes || {}, children);
            // if (dom.toString() === '[object Promise]') {
            const result = transformAsyncDom(dom) as any;
            if ($mount) {
                // todo bugfix
                if (typeof $mount === 'string') $mount = document.querySelector($mount);
                appendChild($mount, result);
                // $mount.appendChild(result);
            }
            return result;
        }
        // @ts-ignore
        const result: IJSXDomOptions = { tag, attributes, children, jsx: true };
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