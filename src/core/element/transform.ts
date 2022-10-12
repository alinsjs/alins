/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:20:04
 * @Description: Coding something
 */

import {IJson} from '../common';
import {IReactBinding} from '../reactive/react';

export interface IElement {
    tag: string;
    className: string;
    id: string;
    textContent: string;
    attributes: IJson<string>;
    children?: IElementBuilder[];
    reaction?: IReactBinding;
}

export interface IElementBuilder {
  (): IElement;
}

export interface IComponentElement {

}

export function transformBuilderToDom (builder: IElementBuilder): HTMLElement {
    const config = builder();
    const dom = document.createElement(config.tag);
    if (config.textContent) dom.innerText = config.textContent;
    if (config.className) dom.className = config.className;
    if (config.attributes) {
        for (const k in config.attributes) {
            dom.setAttribute(k, config.attributes[k]);
        }
    }
    if (config.id) dom.id = config.id;

    if (config.reaction) {
        const {context} = config.reaction;
        switch (context.type) {
            case 'dom-info': applyDomInfoReaction(dom, config.reaction);
        }
    }

    if (config.children) {
        for (const item of config.children) {
            dom.appendChild(transformBuilderToDom(item));
        }
    }

    return dom;
}

function applyDomInfoReaction (dom: HTMLElement, reaction: IReactBinding) {
    console.log(dom, reaction);
    reaction;
    debugger;
}

export type IElementOptions = Partial<IElement>


export function createElement ({
    tag = '',
    className = '',
    id = '',
    textContent = '',
    attributes = {},
    children,
    reaction,
}: IElementOptions): IElement {
    return {
        tag,
        className,
        id,
        textContent,
        attributes,
        children,
        reaction,
    };
}