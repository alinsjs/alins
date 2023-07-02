/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 08:35:17
 * @Description: Coding something
 */

import {AlinsType, type} from 'alins-utils';

export interface IElement {
  [type]?: AlinsType.Element;
  appendChild(child: IElement|ITextNode): void;
  // target stopPropagation preventDefault
  addEventListener(eventName: string, listener: (e: Event)=>void, useCapture?: boolean): void;
  removeEventListener(eventName: string, listener: (e: Event)=>void, useCapture?: boolean): void;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  getAttribute(name: string): string;
  classList: {
    add(name: string): void;
    remove(name: string): void;
  }
  insertBefore<T extends IElement>(node: T, child: IElement | null): T;
  remove(): void;
  get parentElement(): IElement;
  get nextSibling(): IElement;
  get className(): string;
  set className(value: string);
  get innerHTML(): string;
  set innerHTML(value: string);
  get innerText(): string;
  set innerText(value: string);
}
export interface ITextNode {
  [type]?: AlinsType.TextNode;
  get textContent(): string;
  set textContent(value: string);
}

export const Renderer = {
    createElement (tag: string): IElement {
        const el = document.createElement(tag);
        // @ts-ignore
        el[type] = AlinsType.Element;
        return el as IElement;
    },
    createTextNode (text: string) {
        const el = document.createTextNode(text);
        // @ts-ignore
        el[type] = AlinsType.TextNode;
        return el as ITextNode;
    },
    createEmptyMountNode (): IElement {
        return document.createComment('') as any;
    },
    createDocumentFragment (): IElement {
        return document.createDocumentFragment() as any;
    },
    isOriginElement (el: any) {
        return el instanceof Node;
    }
};