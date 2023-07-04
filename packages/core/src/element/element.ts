/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:31:56
 * @Description: Coding something
 */
import {addEvent, IEventNames} from './event';
import {IElement, IFragment, IGeneralElement, ITrueElement, Renderer} from './renderer';
import {
    reactiveBinding, IBindingReactionEnable, reactiveBindingEnable,
    reactiveClass, IChildren,
} from './dom-util';
import {AlinsType, IJson, type} from 'alins-utils';
import {IBindingReaction, IBindingRef} from 'alins-reactive';

export type IAttributeNames = 'accesskey'|'alt'|'async'|'autoplay'|'checked'|
    'color'|'cols'|'dir'|'disabled'|'enctype'|'formnovalidate'|
    'height'|'hidden'|'id'|'lang'|'maxlength'|'name'|'nonce'|
    'readonly'|'required'|'size'|'src'|'style'|'summary'|'tabindex'|
    'target'|'title'|'type'|'value'|'href'|'selected'|'poster'|
    'muted'|'controls'|'loop'|'border'|'cellspacing'|'cellpadding'|
    'rowspan'|'colspan';

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
        if (opt.text) {
            // @ts-ignore
            el.textContent = reactiveBinding(opt.text, (v) => {el.textContent = v;});
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

        for (const k in opt.attributes) {
            const v = opt[k];
            if (typeof v === 'function' && v[type] !== AlinsType.BindResult) {
                // @ts-ignore
                addEvent(el, k, v);
            } else if (k === 'class') {
                // @ts-ignore
                el.className = reactiveClass(v, (key, value) => {
                    el = el as IElement;
                    console.log(key, value);
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
                console.warn('reactiveBindingEnable', k, value);
                // @ts-ignore
                el.setAttribute(k, value);
            }
        }
    }
    return el;
}

export function appendChildren (parent: IElement|IFragment, children: (IChildren|IJSXDomOptions)[]) {
    for (const item of children) {
        if (!item) continue;

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
    createElement (tag: string, attributes: any, ...children: any[]): ITrueElement {
        const result: IJSXDomOptions = {tag, attributes, children, jsx: true};
        console.log('createElement', result);
        return transformOptionsToElement(result);
    }
};