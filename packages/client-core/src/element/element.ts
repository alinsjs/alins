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
        el = isDom ? Renderer.createElement(opt.tag as string) : Renderer.createFragment();
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
                    case '$appended': (el as IElement).__$appended = v; break;
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
                            // console.warn('reactiveBindingEnable', k, v);
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