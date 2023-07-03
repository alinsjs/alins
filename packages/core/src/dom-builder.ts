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
import {AlinsType, child, IJson, type} from 'alins-utils';
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

export type IDomOptions<T = IChildren[]> = {
  // event
  [prop in IEventNames]?: (e: Event) => void;
} & {
    [prop2 in IAttributeNames]?: IBindingReactionEnable;
} & {
  $tag?: string;
  $html?: IBindingReaction;
  $child?: T;
  $life?: any; // todo
  class?: IBindingReaction | IClassReaction;
} & {
    [prop in string]: any;
}

function transformOptionsToDom (opt: IDomOptions): IElement {
    const el = Renderer.createElement(opt.$tag || 'div');
    delete opt.$tag;

    // 元素内容处理
    if (opt.$html) {
        el.innerHTML = reactiveBinding(opt.$html, (v) => {el.innerHTML = v;});
        delete opt.$html;
        delete opt.$child;
    } else if (opt.$child) {
        appendChildren(el, opt.$child);
        delete opt.$child;
    }

    // 生命周期
    if (opt.$life) {
        // todo
        delete opt.$life;
    }

    // 属性处理
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

function isDomBuilder (node: IElementLike) {
    return node[type] === AlinsType.ElementBuilder;
}

// dom({})
export function builder (options: IDomOptions): IElementBuilder {
    let _dom: IElement;
    const builder: IElementBuilder = {
        [type]: AlinsType.ElementBuilder,
        dom () {
            if (!_dom) return _dom = transformOptionsToDom(options);
            return _dom;
        },
        mount (parent: IElement|IElementBuilder) {
            // @ts-ignore
            parent.appendChild(isDomBuilder(parent) ? builder : builder.dom());
        },
        appendChild (child: IElementLike) {
            if (_dom) {
                // @ts-ignore
                _dom.appendChild(isDomBuilder(child) ? child.dom() : child);
            } else {
                // builder append builder
                const c = options.$child;
                if (!c) options.$child = [child];
                else if (c instanceof Array) c.push(child);
                else options.$child = [c, child];
            }
        }
    };
    return builder;
}

export function appendChildren (parent: IElement|IElementBuilder, children: IChildren|IChildren[]) {
    if (!Array.isArray(children)) children = [children];
    transformChildren(children, item => {
        if (item[type] === AlinsType.ElementBuilder) {
            item.mount(parent);
        } else {
            parent.appendChild(item);
        }
    });
}

export function transformChildren (children: IChildren[], each: (el: IElementLike)=>void) {
    for (let item of children) {
        if (!item) continue;
        if (Renderer.isOriginElement(item)) {
            each(item as any); continue;
        }
        if ((item as any)[child]) {
            // @ts-ignore
            item = item[child]();
        }
        if (item instanceof Array) {
            transformChildren(item, each);
            continue;
        }
        let el: any = null;
        if (isElementLike(item)) {
            el = item;
        } else {
            el = Renderer.createTextNode(reactiveBinding(item as IBindingReaction, (v) => {
                el.textContent = v;
            }));
        }
        console.log('children.forEach', el);
        each(el);
    };
}
