/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:20:04
 * @Description: Coding something
 */

import {IJson} from '../common';
import {createFuncProcessMemo} from '../memorize/memorize';
// import {batchMountDom} from '../mount';
import {IDomInfoData, parseDomInfo} from '../parser/info-parser';
import {createReplacement, extractReplacement, parseReplacementToNumber, reactiveTemplate, ReplaceExp} from '../reactive/binding';
import {IReactBinding, subscribe} from '../reactive/react';
import {join} from '../utils';

export interface IElement {
    tag: string;
    className: string[];
    id: string;
    textContent: string;
    attributes: IJson<string>;
    children?: (IElementBuilder|IElementBuilder[])[];
    binding?: IReactBinding;
    domInfo?: string;
}

export interface IElementBuilder {
  (): IElement;
}

export interface IComponentElement {

}

function mergeDomInfo (element: IElement, domInfo: IDomInfoData) {
    // merge instead of assign
    // InfoKeys.forEach(key => {
    //     if (!domInfo[key]) return;
    //     if (typeof element[key] === 'string') (element[key] as string) += domInfo[key];
    //     else if (element[key] instanceof Array)
    //         (element[key] as string[]).push(...(domInfo[key] as string[]));
    //     else if (typeof element[key] === 'object') Object.assign(element[key], domInfo[key]);
    // });
    // todo 简化计算
    if (domInfo.attributes) Object.assign(element.attributes, domInfo.attributes);
    if (domInfo.className) element.className.push(...domInfo.className);
    if (domInfo.id) element.id += domInfo.id;
    if (domInfo.textContent) element.textContent += domInfo.textContent;
    // todo 新属性
}

// const div = document.createElement('div');

export function transformBuilderToDom (
    builder: IElementBuilder,
): HTMLElement {
    const element = builder();
    const dom = document.createElement(element.tag);
    // memo.add;
    // if (!dom) dom = div.cloneNode() as HTMLElement;
    // console.log(element);
    if (element.binding) { // todo 支持多个binding
        const {context} = element.binding;
        switch (context.type) {
            case 'dom-info': {
                // 提取表达式中没有binding的属性 merge到element中
                const domInfo = applyDomInfoReaction(dom, element.binding);
                mergeDomInfo(element, domInfo);
            }; break;
            // todo other binding types
        }
    }
    
    if (element.domInfo) mergeDomInfo(element, parseDomInfo(element.domInfo));

    if (element.textContent) dom.innerText = element.textContent;
    if (element.className.length > 0) dom.className = element.className.join(' ');
    if (element.attributes) {
        for (const k in element.attributes) {
            dom.setAttribute(k, element.attributes[k]);
        }
    }
    if (element.id) dom.id = element.id;


    if (element.children) {
        for (const item of element.children) {
            // ! for controller
            if (item instanceof Array) {
                const frag = document.createDocumentFragment();
                // ! 大于100个元素时启用memo
                // memo 要求必须同步
                const memo = item.length > 100 ? createFuncProcessMemo<typeof transformBuilderToDom>() : undefined;
                for (const deepItem of item) {
                    frag.appendChild(memo?.exe(deepItem) || transformBuilderToDom(deepItem));
                }
                dom.appendChild(frag);
                memo?.destory();
                // batchMountDom(dom, item.map(i => transformBuilderToDom(i)));
            } else {
                dom.appendChild(transformBuilderToDom(item));
            }
        }
    }
    // console.log('dom done', dom.children.length);
    return dom;
}

let lastBindings :any = null;

function applyDomInfoReaction (dom: HTMLElement, binding: IReactBinding): IDomInfoData {
    const {template, reactions} = binding;
    console.assert(lastBindings === binding);
    lastBindings = binding;
    const replacement = join(template, createReplacement);
    // const
    const info = parseDomInfo(replacement);

    const data: IDomInfoData = {};

    if (info.textContent) {
        const textContent = info.textContent;
        const results = extractReplacement(textContent);
        if (results) {
            const texts = textContent.split(ReplaceExp);
            texts.forEach((text, i) => {
                if (text) dom.appendChild(document.createTextNode(text));
                if (!results[i]) return;
                const index = parseReplacementToNumber(results[i]);
                const reaction = reactions[index];
                if (!reaction) return;
                // ! 关键代码
                const node = document.createTextNode(
                    reaction[subscribe]((v) => {node.textContent = v;})
                );
                dom.appendChild(node);
            });
        } else {
            data.textContent = textContent;
        }
    }

    if (info.className) {
        info.className.forEach(name => {
            if (!data.className) data.className = [];
            data.className.push(
                reactiveTemplate(name, reactions, (content, oldContent) => {
                    dom.classList.replace(oldContent, content);
                }, true)
            );
        });
    }

    /**
     * $$1$$: "1"
     * a: "$$2$$"
     * b: "2"
     */
    if (info.attributes) {
        for (const k in info.attributes) {
            let value = '';
            let key = reactiveTemplate(k, reactions, (content, oldContent) => {
                dom.removeAttribute(oldContent);
                dom.setAttribute(content, value);
                key = content;
            }, true);
            value = reactiveTemplate(info.attributes[k], reactions, (content) => {
                dom.setAttribute(key, content);
                value = content;
            });
            if (!data.attributes) data.attributes = {};
            data.attributes[key] = value;
        }
    }

    if (info.id) {
        const id = reactiveTemplate(info.id, reactions, (content) => {
            dom.id = content;
        });
        dom.id = id;
    }
    return data;
    // console.log(info, dom, binding, replacement, reactions);
}

export type IElementOptions = Partial<IElement>

export function createElement ({
    tag = '',
    className = [],
    id = '',
    textContent = '',
    attributes = {},
    children,
    binding,
    domInfo = ''
}: IElementOptions): IElement {
    return {
        tag,
        className,
        id,
        textContent,
        attributes,
        children,
        binding,
        domInfo,
    };
}