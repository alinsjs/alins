/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 08:35:17
 * @Description: Coding something
 */

import { AlinsType, type } from 'alins-utils';

export type IFragment = DocumentFragment;

// eslint-disable-next-line no-undef
export type ITrueElement = JSX.Element | IElement | ITextNode | IFragment;
// 广义元素
export type IGeneralElement = ITrueElement | null;

export interface IElement {
    // @ts-ignore
    [type]?: AlinsType.Element;
    appendChild(child: ITrueElement): void;
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
    insertBefore<T extends ITrueElement>(node: T, child: IElement | null): T;
    remove(): void;
    children: (IElement|ITextNode)[];
    childNodes: (IElement|ITextNode)[];
    get parentElement(): IElement;
    get parentNode(): IElement;
    get nextSibling(): IElement;
    get className(): string;
    set className(value: string);
    get innerHTML(): string;
    set innerHTML(value: string);
    get innerText(): string;
    set innerText(value: string);
    __$appended: any;
    __$removed: any;
    __$mounted: any;
}
export interface ITextNode {
    // @ts-ignore
    [type]?: AlinsType.TextNode;
    get textContent(): string;
    set textContent(value: string);
}
let id = 0;
export const Renderer = {
    createElement (tag: string): IElement {
        const el = document.createElement(tag);
        // @ts-ignore
        el[type] = AlinsType.Element;
        return el as any as IElement;
    },
    createTextNode (text: string) {
        const el = document.createTextNode(text);
        // @ts-ignore
        el[type] = AlinsType.TextNode;
        return el as ITextNode;
    },
    createEmptyMountNode (): IElement {
        return document.createComment('' + (id++)) as any;
    },
    createDocumentFragment (): IFragment {
        return document.createDocumentFragment();
    },
    isFragment (el: any): boolean {
        return el instanceof DocumentFragment;
    },
    isOriginElement (el: any) {
        return el instanceof Node;
    },
    isElement (el: any) {
        return this.isFragment(el) || this.isOriginElement(el);
    },
    removeElement (el: any) {
        el.remove();
    }
};

export function getFirstElement (element?: IGeneralElement) {
    if (!element) return null;
    // @ts-ignore
    return (Renderer.isFragment(element) ? (element.firstChild) : element);
}