/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:20:04
 * @Description: Coding something
 */

import {IJson} from '../common';

export interface IElement {
    tag: string;
    className: string;
    id: string;
    textContent: string;
    attributes: IJson<string>;
    children?: IElementBuilder[];
}

export interface IElementBuilder {
  (): IElement;
}

export interface IComponentElement {

}

export function transformBuilderToDom (builder: IElementBuilder): HTMLElement {
    const el = builder();
    const dom = document.createElement(el.tag);
    if (el.textContent) dom.innerText = el.textContent;
    if (el.className) dom.className = el.className;
    if (el.attributes) {
        for (const k in el.attributes) {
            dom.setAttribute(k, el.attributes[k]);
        }
    }
    if (el.id) dom.id = el.id;

    if (el.children) {
        for (const item of el.children) {
            dom.appendChild(transformBuilderToDom(item));
        }
    }

    return dom;
}

export type IElementOptions = Partial<Pick<
    IElement,
    'tag' | 'className' | 'id' | 'textContent' | 'attributes' | 'children'
>>


export function createElement ({
    tag = '',
    className = '',
    id = '',
    textContent = '',
    attributes = {},
    children,
}: IElementOptions): IElement {
    return {
        tag,
        className,
        id,
        textContent,
        attributes,
        children,
    };
}