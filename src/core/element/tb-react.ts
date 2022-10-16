/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:20:04
 * @Description: Coding something
 */

import {IJson} from '../common';
import {IBuilderParameter} from '../core';
import {createFuncProcessMemo, TFPMemo} from '../memorize/memorize';
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

export interface IElementBuilder extends IBuilderParameter {
    type: 'builder'; // todo comp
    exe(): IElement;
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

const map: Map<string, TFPMemo> = new Map();
let cloneNodeCount = 0;
let cloneNodeCountNo = 0;
 
// const div = document.createElement('div');
export function transformBuilderToDom (builder: IElementBuilder): HTMLElement {
    const config = builder.exe(); // ! 关键代码 执行builder
    // console.count('transformBuilderToDomCount');

    const str = JSON.stringify(config);
    let memo = map.get(str);
    if (memo) {
        cloneNodeCount++;
        // console.count('cloneNode');
        const dom = memo.exe(config);
        return dom;
    }
    cloneNodeCountNo++;

    memo = createFuncProcessMemo<typeof transformBuilderToDom>();
    map.set(str, memo);

    // console.log('transformBuilderToDom', builder, config, config.domInfo);
    // console.warn('transformBuilderToDom', JSON.stringify(config));

    const dom = document.createElement(config.tag);

    memo.add(() => dom.cloneNode());
    // console.log('transformBuilderToDom', config);
    // if (!dom) dom = div.cloneNode() as HTMLElement;
    // debugger;
    if (config.binding) { // todo 支持多个binding
        const {context} = config.binding;
        switch (context.type) {
            case 'dom-info': {
                // 提取表达式中没有binding的属性 merge到config中
                const domInfo = applyDomInfoReaction(dom, config.binding, memo);
                mergeDomInfo(config, domInfo);
                // ! binding 执行
                
            }; break;
            // todo other binding types
        }
    }
    
    if (config.domInfo) mergeDomInfo(config, parseDomInfo(config.domInfo));

    if (config.textContent) {
        dom.innerText = config.textContent;
        memo.add(() => {
            const dom = (memo?.last);
            dom.innerText = config.textContent;
            return dom;
        });
    }
    if (config.className.length > 0) dom.className = config.className.join(' ');
    if (config.attributes) {
        for (const k in config.attributes) {
            dom.setAttribute(k, config.attributes[k]);
        }
    }
    if (config.id) dom.id = config.id;


    if (config.children && config.children.length > 0) {
        mountChildrenDoms(dom, config.children);

        memo.add((config: IElement) => {
            // todo 优化此部分逻辑
            // ? 是否可以根据div标记来缓存 可以最大化缓存数量
            const dom = memo?.last;
            mountChildrenDoms(dom, config.children || []);
            return dom;
        });
    }
    // // console.log('dom done', dom.children.length);
    // // ! 缓存节点 直接clone使用 可以提升性能
    // console.log((Memo.funcProcInstance as any).name);
    // debugger;
    return dom;
}

function mountChildrenDoms (dom: HTMLElement, children: (IElementBuilder | IElementBuilder[])[]) {
    for (const item of children) {
        if (item instanceof Array) {
            // (memo as any).name = i++;
            // debugger;
            const frag = document.createDocumentFragment();
            for (const child of item) {
                // ! 关键代码 根据build解析dom 渲染到父元素
                frag.appendChild(transformBuilderToDom(child));
            }
            dom.appendChild(frag);
        // batchMountDom(dom, item.map(i => transformBuilderToDom(i)));
        } else {
            // console.count('use_memo_no');
            dom.appendChild(transformBuilderToDom(item));
        }
    }
}

function applyDomInfoReaction (dom: HTMLElement, binding: IReactBinding, memo: TFPMemo): IDomInfoData {
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
                memo.add((config: IElement) => {
                    const {reactions} = config.binding as any;
                    const newDom = memo?.last;
                    const reaction = reactions[index];
                    // ! 关键代码
                    const node = document.createTextNode(
                        reaction[subscribe]((v: any) => {node.textContent = v;})
                    );
                    newDom.appendChild(node);
                    return newDom;
                });
            });
        } else {
            data.textContent = textContent;
        }
    }

    if (info.className) {
        info.className.forEach(name => {
            if (!data.className) data.className = [];
            data.className.push(
                reactiveTemplate(memo, dom, name, reactions, (dom, content, oldContent) => {
                    debugger;
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
            let key = reactiveTemplate(memo, dom, k, reactions, (dom, content, oldContent) => {
                dom.removeAttribute(oldContent);
                dom.setAttribute(content, value);
                key = content;
            }, true);
            value = reactiveTemplate(memo, dom, info.attributes[k], reactions, (dom, content) => {
                dom.setAttribute(key, content);
                value = content;
            });
            if (!data.attributes) data.attributes = {};
            data.attributes[key] = value;
        }
    }

    if (info.id) {
        const id = reactiveTemplate(memo, dom, info.id, reactions, (dom, content) => {
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