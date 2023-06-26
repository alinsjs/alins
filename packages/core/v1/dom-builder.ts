/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:31:56
 * @Description: Coding something
 */
import {TReactionValue} from 'packages/utils/src';
import {addEvent, IEventNames} from './event';
import {html} from './html';
import {IElement, Renderer} from './renderer';
import {exeReactionValue} from 'alins-reactive';

const AttributeNames = [
    'accesskey', 'alt', 'async', 'autoplay', 'checked', 'class',
    'color', 'cols', 'dir', 'disabled', 'enctype', 'formnovalidate',
    'height', 'hidden', 'id', 'lang', 'maxlength', 'name', 'nonce',
    'readonly', 'required', 'size', 'src', 'style', 'summary', 'tabindex',
    'target', 'title', 'type', 'value', 'href', 'selected', 'poster',
    'muted', 'controls', 'loop', 'border', 'cellspacing', 'cellpadding',
    'rowspan', 'colspan'
] as const;

export type IAttributeNames = (typeof AttributeNames)[number];

export type IDomReactionValue = TReactionValue<number|string>;

export type IDomOptions = {
  // event
  [prop in IEventNames]?: (e: Event) => void;
} & {
  [prop2 in IAttributeNames]?: IDomReactionValue|boolean;
} & {
  $tag?: string;
  $html?: IDomReactionValue;
  $child?: IElementLike[];
  $life?: any;
} & {
  [prop in string]?: string|number|boolean;
}

export type IElementLike = IElement|IElementBuilder;

export interface IElementBuilder {
  _isBuilder: true;
  _dom: IElement|null;
  mount(parent: IElementLike): void;
  appendChild(parent: IElementLike): void;
}

function reactiveContent (reaction: IDomReactionValue, onchange: (v:string)=>void) {
    return exeReactionValue(reaction, (v) => {onchange(v + '');}) + '';
}

function transformOptionsToDom (opt: IDomOptions): IElement {
    const el = Renderer.createElement(opt.$tag || 'div');
    delete opt.$tag;

    if (opt.$html) {
        el.innerHTML = reactiveContent(opt.$html, (v) => {el.innerHTML = v;});
        delete opt.$html;
        delete opt.$child;
    } else if (opt.$child) {
        // todo
    }

    if (opt.$life) {
        // todo
        delete opt.$life;
    }

    for (const k in opt) {
        const v = opt[k];
        if (typeof v === 'function') {
            addEvent(el, k, v);
        } else if (k === 'class') {
          
        } else {
            el.setAttribute(k, reactiveContent(v, (v) => {
                el.setAttribute(k, v);
            }));
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

export function dom (options: IDomOptions): IElementBuilder {
    const domElement: IElementBuilder = {
        _isBuilder: true,
        _dom: null,
        mount (parent: IElementLike) {
            if (parent._isBuilder) {
                parent.appendChild(domElement);
            } else {
                this._dom = transformOptionsToDom(options);
                parent.appendChild(this._dom);
            }
        },
        appendChild (child: IElementLike) {
            if (child._isBuilder) {
                child.mount(this._dom || this);
            } else { // dom 元素
                if (this._dom) {
                    this._dom.appendChild(child);
                } else {
                    if (!options.$child) options.$child = [];
                    options.$child.push(child);
                }
            }
        }
    };
    return domElement;
}