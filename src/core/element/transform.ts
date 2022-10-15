/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:20:04
 * @Description: Coding something
 */

import {IJson} from '../common';
import {createFuncProcessMemo, Memo} from '../memorize/memorize';
// import {batchMountDom} from '../mount';
import {IDomInfoData, InfoKeys, parseDomInfo} from '../parser/info-parser';
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

function mergeDomInfo (config: IElement, domInfo: IDomInfoData) {
    // // merge instead of assign
    // InfoKeys.forEach(key => {
    //     if (!domInfo[key]) return;
    //     if (typeof domInfo[key] === 'string') (config[key] as string) += domInfo[key];
    //     else if (domInfo[key] instanceof Array)
    //         (config[key] as string[]).push(...(domInfo[key] as string[]));
    //     else if (typeof domInfo[key] === 'object') Object.assign(config[key], domInfo[key]);
    // });

    // 优化性能
    if (domInfo.className) config.className.push(...domInfo.className);
    if (domInfo.attributes) Object.assign(config.attributes, domInfo.attributes);
    if (domInfo.id) config.id = domInfo.id;
    if (domInfo.textContent) config.textContent += domInfo.textContent;
}
 
// const div = document.createElement('div');

export function transformBuilderToDom (builder: IElementBuilder): HTMLElement {
    const config = builder();
    // Memo.funcProcInstance?.add((builder: IElementBuilder) => builder());

    // Memo.funcProcInstance?.add();
    const dom = document.createElement(config.tag);
    // console.log('transformBuilderToDom', config);
    // if (!dom) dom = div.cloneNode() as HTMLElement;
    // debugger;
    if (config.binding) { // todo 支持多个binding
        const {context} = config.binding;
        switch (context.type) {
            case 'dom-info': {
                // 提取表达式中没有binding的属性 merge到config中
                const domInfo = applyDomInfoReaction(dom, config.binding);
                mergeDomInfo(config, domInfo);
            }; break;
            // todo other binding types
        }
    }
    
    if (config.domInfo) mergeDomInfo(config, parseDomInfo(config.domInfo));

    if (config.textContent) dom.innerText = config.textContent;
    if (config.className.length > 0) dom.className = config.className.join(' ');
    if (config.attributes) {
        for (const k in config.attributes) {
            dom.setAttribute(k, config.attributes[k]);
        }
    }
    if (config.id) dom.id = config.id;


    if (config.children) {
        for (const item of config.children) {
            if (item instanceof Array) {
                // const memo = createFuncProcessMemo<typeof transformBuilderToDom>();
                const frag = document.createDocumentFragment();
                for (const deepItem of item) {
                    // frag.appendChild(memo?.exe(deepItem) || transformBuilderToDom(deepItem));
                    frag.appendChild(transformBuilderToDom(deepItem));
                }
                // memo.destory();
                dom.appendChild(frag);
                // batchMountDom(dom, item.map(i => transformBuilderToDom(i)));
            } else {
                dom.appendChild(transformBuilderToDom(item));
            }
        }
    }
    // console.log('dom done', dom.children.length);
    return dom;
}

function applyDomInfoReaction (dom: HTMLElement, binding: IReactBinding): IDomInfoData {
    const {template, reactions} = binding;
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