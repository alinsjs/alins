/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:20:04
 * @Description: Coding something
 */

import {IComponentBuilder} from '../comp/comp';
import {IModelBuilder} from '../controller/model';
import {IIfBuilder} from '../controller/if';
import {IShowBuilder} from '../controller/show';
import {ISwitchBuilder} from '../controller/switch';
import {IEventBuilder} from '../event/on';
// import {batchMountDom} from '../mount';
import {IDomInfoData, parseDomInfo} from '../parser/info-parser';
import {
    createReplacement, extractReplacement,
    parseReplacementToNumber, reactiveTemplate,
    ReplaceExp, subscribe, transformToReaction, join,
} from 'alins-reactive';
import {IJson, IBuilderParameter} from 'alins-utils/src/types/common.d';
import {
    IReactBinding, TReactionItem
} from 'alins-utils/src/types/react.d';
import {
    IStyleBuilder, IStyleAtoms,
} from 'alins-utils/src/types/style.d';
import {IForBuilder} from '../controller/for';

export type TElementChild = null | IElementBuilder | IElementBuilder[] | IComponentBuilder | IComponentBuilder[];

export type TChild = TElementChild |
    IStyleBuilder | IStyleAtoms |
    IForBuilder |
    IIfBuilder | IShowBuilder | IModelBuilder | ISwitchBuilder<any> | TChild[];

export interface IElement {
    tag: string;
    className: string[];
    id: string;
    textContent: string;
    attributes: IJson<string>;
    children?: TChild[];
    binding: IReactBinding[];
    event: IEventBuilder[];
    domInfo: string;
    _if?: IIfBuilder;
    show?: TReactionItem;
    styles: (IStyleBuilder | IStyleAtoms)[];
}

export interface IElementBuilder extends IBuilderParameter {
    type: 'builder'; // todo comp
    exe(): IElement;
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

// const map: Map<string, TFPMemo> = new Map();
// const cloneNodeCount = 0;
// const cloneNodeCountNo = 0;
 
// const div = document.createElement('div');
export function transformBuilderToDom (builder: IElementBuilder): HTMLElement {
    const config = builder.exe(); // ! 关键代码 执行builder
    // debugger;
    // console.count('transformBuilderToDomCount');

    // const str = JSON.stringify(config);
    // let memo = map.get(str);
    // if (memo) {
    //     cloneNodeCount++;
    //     // console.count('cloneNode');
    //     const dom = memo.exe(config);
    //     return dom;
    // }
    // cloneNodeCountNo++;

    // memo = createFuncProcessMemo<typeof transformBuilderToDom>();
    // map.set(str, memo);

    // console.log('transformBuilderToDom', builder, config, config.domInfo);
    // console.warn('transformBuilderToDom', JSON.stringify(config));

    const dom = document.createElement(config.tag);

    // memo.add(() => dom.cloneNode());
    // console.log('transformBuilderToDom', config);
    // if (!dom) dom = div.cloneNode() as HTMLElement;
    // debugger;
    // if (!config.binding) debugger;
    for (let i = 0; i < config.binding.length; i++) {
        const binding = config.binding[i];
        switch (binding.context.type) {
            case 'dom-info': {
                // 提取表达式中没有binding的属性 merge到config中
                const domInfo = applyDomInfoReaction(dom, binding);
                mergeDomInfo(config, domInfo);
                // ! binding 执行
                    
            }; break;
                // todo other binding types
        }
    }
    
    if (config.domInfo) mergeDomInfo(config, parseDomInfo(config.domInfo));

    if (config.textContent) {
        setNodeText(dom, config.textContent);
        // memo.add(() => {
        //     const dom = (memo?.last);
        //     dom.innerText = config.textContent;
        //     return dom;
        // });
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

        // memo.add((config: IElement) => {
        //     // todo 优化此部分逻辑
        //     // ? 是否可以根据div标记来缓存 可以最大化缓存数量
        //     const dom = memo?.last;
        //     mountChildrenDoms(dom, config.children || []);
        //     return dom;
        // });
    }

    for (let i = 0; i < config.event.length; i++) {
        config.event[i].exe(dom);
    };

    config.styles.forEach(style => style.exe(dom));

    // // console.log('dom done', dom.children.length);
    // // ! 缓存节点 直接clone使用 可以提升性能
    // console.log((Memo.funcProcInstance as any).name);
    // debugger;
    return dom;
}

export function mountChildrenDoms (
    parent: HTMLElement,
    children: TChild[]
) {
    const frag = document.createDocumentFragment();
    for (const item of children) {
        mountSingleChild(parent, frag, item);
    }
    parent.appendChild(frag);
}

function mountSingleChild (
    parent: HTMLElement,
    frag: DocumentFragment,
    item: TChild
) {
    if (item instanceof Array) {
        for (const child of item) {
            mountSingleChild(parent, frag, child);
        }
    } else if (item instanceof HTMLElement) {
        frag.appendChild(item);
    } else if (item) {
        switch (item.type) {
            case 'comp':
                mountSingleChild(parent, frag, item.exe()); break;
            case 'builder':
                frag.appendChild(transformBuilderToDom(item)); break;
            case 'if':
            case 'switch':
                frag.appendChild(item.exe(parent)); break;
            case 'for':
            case 'show':
            case 'model':
                frag.appendChild(item.exe()); break;
        }
        // todo life mounted
    }
}

function setNodeText (node: HTMLElement | Text, v: string) {
    if (isInputNode(node)) (node as any).value = v;
    else node.textContent = v;
}

function isInputNode (node: HTMLElement | Text) {
    return typeof (node as any).value !== 'undefined' && (node as HTMLElement).tagName !== 'BUTTON';
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
            if (isInputNode(dom)) {
                (dom as any).value = reactiveTemplate(textContent, reactions, (content) => {
                    (dom as any).value = content;
                }, false);
            } else {
                const texts = textContent.split(ReplaceExp);
                texts.forEach((text, i) => {
                    if (text) dom.appendChild(document.createTextNode(text));
                    if (!results[i]) return;
                    const index = parseReplacementToNumber(results[i]);
                    const reactionItem = reactions[index];
                    if (!reactionItem) return;
                    const reaction = transformToReaction(reactionItem);
                    // ! 关键代码
                    const node = document.createTextNode(
                        reaction[subscribe]((v) => {
                            node.textContent = v;
                        })
                    );
                    dom.appendChild(node);
                    // memo.add((config: IElement) => {
                    //     const {reactions} = config.binding as any;
                    //     const newDom = memo?.last;
                    //     const reaction = reactions[index];
                    //     // ! 关键代码
                    //     const node = document.createTextNode(
                    //         reaction[subscribe]((v: any) => {node.textContent = v;})
                    //     );
                    //     newDom.appendChild(node);
                    //     return newDom;
                    // });
                });
            }
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
    binding = [],
    domInfo = '',
    event = [],
    _if,
    styles = [],
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
        event,
        _if,
        styles,
    };
}