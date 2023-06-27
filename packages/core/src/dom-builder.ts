/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:31:56
 * @Description: Coding something
 */
import {addEvent, IEventNames} from './event';
import {IElement, Renderer} from './renderer';
import {
    IElementLike, reactiveBinding, IBindingReactionEnable, reactiveBindingEnable,
    reactiveClass, IElementBuilder, IChildren, isElementLike
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

export type IDomOptions = {
  // event
  [prop in IEventNames]?: (e: Event) => void;
} & {
    [prop2 in IAttributeNames]?: IBindingReactionEnable;
} & {
  $tag?: string;
  $html?: IBindingReaction;
  $child?: IChildren;
  $life?: any; // todo
  class?: IBindingReaction | IClassReaction;
} & {
    [prop in string]: any;
}

function transformOptionsToDom (opt: IDomOptions): IElement {
    const el = Renderer.createElement(opt.$tag || 'div');
    delete opt.$tag;

    if (opt.$html) {
        el.innerHTML = reactiveBinding(opt.$html, (v) => {el.innerHTML = v;});
        delete opt.$html;
        delete opt.$child;
    } else if (opt.$child) {
        transformChildren(opt.$child, item => {
            if (item[type] === AlinsType.ElementBuilder) {
                item.mount(el);
            } else {
                el.appendChild(item);
            }
        });
        delete opt.$child;
    }

    if (opt.$life) {
        // todo
        delete opt.$life;
    }

    for (const k in opt) {
        const v = opt[k];
        if (typeof v === 'function' && v[type] !== AlinsType.BindResult) {
            addEvent(el, k, v);
        } else if (k === 'class') {
            el.className = reactiveClass(v, (key, value) => {
                console.log(key, value);
                if (!key) el.className = value;
                else !!value ? el.classList.add(key) : el.classList.remove(key);
            });
        } else {
            const value = reactiveBindingEnable(v, (v) => {
                el.setAttribute(k, v);
            }, (bool) => {
                bool ? el.setAttribute(k, v) : el.removeAttribute(k);
            });
            // debugger;
            console.warn('reactiveBindingEnable', k, value);
            el.setAttribute(k, value);
        }
    }
    return el;
}

export function domFactory (name: string) {
    return (options: IDomOptions): IElementBuilder => {
        options.$tag = name;
        return dom(options);
    };
}

export const div = domFactory('div');

function isChildren (child: any) {
    return typeof child !== 'object' ||
        (child instanceof Array) ||
        (child instanceof Element) ||
        child instanceof Node ||
        !!child[type];
}

export function dom (arg: IDomOptions|IChildren): IElementBuilder {
    const options = ((isChildren(arg)) ?
        {$child: arg} :
        arg)  as IDomOptions;
    const domElement: IElementBuilder = {
        [type]: AlinsType.ElementBuilder,
        _dom: null,
        mount (parent: IElement|IElementBuilder) {
            if (parent[type] === AlinsType.ElementBuilder) {
                parent.appendChild(domElement);
            } else {
                this._dom = transformOptionsToDom(options);
                (parent).appendChild(this._dom);
            }
        },
        appendChild (child: IElementLike) {
            if (child[type] === AlinsType.ElementBuilder) {
                child.mount(this._dom || this);
            } else { // dom 元素
                if (this._dom) {
                    this._dom.appendChild(child);
                } else {
                    if (!options.$child) options.$child = [];
                    else if (!(options.$child instanceof Array)) options.$child = [options.$child];
                    options.$child.push(child);
                }
            }
        }
    };
    return domElement;
}

export function transformChildren (children: IChildren, each: (el: IElementLike)=>void) {
    if (!(children instanceof Array)) {
        children = [children];
    }

    children.forEach((item: any) => {
        let el: any = null;
        if (isElementLike(item)) {
            el = item;
        } else {
            el = Renderer.createTextNode(reactiveBinding(item, (v) => {
                el.textContent = v;
            }));
        }
        console.log('children.forEach', el);
        each(el);
    });
}
