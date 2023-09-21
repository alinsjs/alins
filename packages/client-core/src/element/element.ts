/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:31:56
 * @Description: Coding something
 */
import { addEvent, isEventAttr, IEventNames } from './event';
import type { IElement, IFragment, ITrueElement, IAttributes } from './alins.d';
import { Renderer, appendChild } from './renderer';
import {
    IBindingReactionEnable, reactiveBindingEnable,
    IChildren, reactiveBindingValue, IBindingReaction, IBindingRef
} from './dom-util';
import { IJson } from 'alins-utils';
import { parseStyle, parseStyleSuffix } from './style';
import { parseModel } from './model';
import { parseAttributes } from './attributes';
import { parseClassName, parseClassSuffix } from './class';
import { renderComponent, IJSXComp } from './component';

export const JSX = {
    createElement (
        tag: string | IJSXComp,
        attributes: IAttributes|null = null,
        ...children: any[]
    ): ITrueElement {
        if (typeof tag === 'function') {
            return renderComponent(tag, attributes, children);
        }
        // @ts-ignore
        const result: IJSXDomOptions = { tag, attributes, children, jsx: true };
        // console.log('createElement', result);
        return transformOptionsToElement(result);
    }
};

export type IAttributeNames = keyof IAttributes;

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
        el = isDom ? Renderer.createElement(opt.tag as string) : Renderer.createFragment();
        if (opt.children && opt.children.length > 0) {
            if (opt.attributes?.$html) {
                console.warn('$html 属性的元素的子元素将失效');
            } else {
                // @ts-ignore
                appendChildren(el, opt.children);
            }
        }

        const target = isDom ? el : el.children[0];
        // @ts-ignore
        const lifeNode = isDom ? el : el.firstChild;

        const attrs = opt.attributes;
        if (attrs) {

            let $mount: any = attrs.$mount;

            if (lifeNode) {
                attrs.$created?.(lifeNode);
                // [ '$appended', '$mounted', '$removed' ].forEach(k => {
                //     if (attrs[k]) lifeNode[`__${key}`] = attrs[k];
                // });
                if (attrs.$appended) lifeNode.__$appended = attrs.$appended;
                if (attrs.$removed) lifeNode.__$removed = attrs.$removed;
                if (attrs.$mounted) lifeNode.__$mounted = attrs.$mounted;
            }

            if (target) {
                for (const k in opt.attributes) {
                    const v = opt.attributes[k];
                    if (isEventAttr(target, k, v)) {
                        addEvent(target, k, v);
                        continue;
                    }
                    switch (k) {
                        case '$created':
                        case '$appended':
                        case '$removed':
                        case '$mounted':
                        case '$mount': break;
                        case '$html': reactiveBindingEnable(v, (v) => {
                            target.innerHTML = v || '';
                        }); break;
                        case '$ref': v(target); break;
                        case '$attributes': parseAttributes(target, v); break;
                        case '$show': reactiveBindingEnable(v, (v) => {
                            target.style.display = v ? '' : 'none';
                        }); break;
                        case 'class': parseClassName(target, v); break;
                        default: {
                            if (
                                (k === 'style' && parseStyle(target, v)) ||
                                parseModel(target, v, k) ||
                                parseClassSuffix(target, k, v) ||
                                parseStyleSuffix(target, k, v)
                            ) {
                                break;
                            } else {
                                // console.warn('reactiveBindingEnable', k, v);
                                reactiveBindingEnable(v, (v) => {
                                    if (typeof v === 'object') {
                                        v = (!!v.enable) ? v.value : null;
                                    }
                                    // @ts-ignore
                                    v === null ? target.removeAttribute(k) : target.setAttribute(k, v);
                                });
                            }
                        }; break;
                    };
                }
            }
            if ($mount) {
                if (typeof $mount === 'string') $mount = Renderer.querySelector($mount);
                if (!$mount) throw new Error('$mount is not a Element');
                appendChild($mount, el);
            }

        }
    }
    return el;
}


export function isJSXElement (item: any) {
    return typeof item === 'object' && item.jsx === true;
}

export function appendChildren (parent: IElement|IFragment, children: (IChildren|IJSXDomOptions)[]) {
    for (const item of children) {
        if (typeof item === 'undefined' || item === null) continue;

        if (Array.isArray(item)) {
            appendChildren(parent, item);
            continue;
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