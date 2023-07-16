/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:20:04
 * @Description: Coding something
 */

// import {batchMountDom} from '../mount';
import {IDomInfoData, parseDomInfo} from '../parser/info-parser';
import {
    createReplacement, extractReplacement,
    parseReplacementToNumber, reactiveTemplate,
    ReplaceExp, subscribe, transformToReaction, join,
} from 'alins-reactive';
import {IReactBinding} from 'alins-utils';
import {IUpdatedCallback, LifeMountedCollector, mountLifes} from '../builder/life';
import {appendFragment} from '../builder/dom-proxy';
import {IElement, IElementBuilder, IElementOptions, mergeDomInfo, TChild} from '../builder/builder';
import {text} from '../builder/text';


// const map: Map<string, TFPMemo> = new Map();
// const cloneNodeCount = 0;
// const cloneNodeCountNo = 0;
 
// const div = document.createElement('div');
export function transformBuilderToDom (builder: IElementBuilder): HTMLElement {
    const config = builder.exe(); // ! 执行builder
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

    let isHTMLFilled = false;

    if (config.html) {
        isHTMLFilled = true;
        dom.innerHTML = config.html.exe((v) => {dom.innerHTML = v;}) + '';
    }

    // memo.add(() => dom.cloneNode());
    // console.log('transformBuilderToDom', config);
    // if (!dom) dom = div.cloneNode() as HTMLElement;
    // if (!config.binding) debugger;
    for (let i = 0; i < config.binding.length; i++) {
        const binding = config.binding[i];
        // 提取表达式中没有binding的属性 merge到config中
        const {domInfo, children} = applyDomInfoReaction(
            isHTMLFilled,
            dom, binding,
            config.lifes.updated?.exe() as IUpdatedCallback,
        );
        if (children.length > 0)
            config.children[binding.index ?? config.children.length] = children;
        mergeDomInfo(config, domInfo);
    }
    
    if (config.domInfo) mergeDomInfo(config, config.domInfo);

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
        if (isHTMLFilled && config.html)
            console.warn('children is not supported in html builder');
        else
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
    config.pseudos.forEach(pseudo => pseudo.exe(dom));

    // // console.log('dom done', dom.children.length);
    // // ! 缓存节点 直接clone使用 可以提升性能
    // console.log((Memo.funcProcInstance as any).name);
    mountLifes(dom, config.lifes);
    LifeMountedCollector.collectMounted(dom, config.lifes.mounted);
    config.lifes.created?.exe()(dom);
    return dom;
}

export function mountChildrenDoms (
    parent: HTMLElement,
    children: TChild[]
) {
    const isInput = isInputNode(parent);
    if (isInput) {
        for (const item of children) {
            // @ts-ignore
            if (item?.type === 'text')
                item.exe(parent, true);
        }
    } else {
        const frag = document.createDocumentFragment();
        for (const item of children) {
            frag.appendChild(mountSingleChild(item));
        }
        appendFragment(parent, frag);
    }

}

export function mountSingleChild (
    item: TChild | (() => TChild),
): DocumentFragment {
    const frag = document.createDocumentFragment();
    if (typeof item === 'function') {
        return mountSingleChild(item());
    } else if (item instanceof Array) {
        for (const child of item) {
            frag.appendChild(mountSingleChild(child));
        }
    } else if (item instanceof HTMLElement || item instanceof Text) {
        frag.appendChild(item);
    } else if (item) {
        switch (item.type) {
            case 'comp':
                frag.appendChild(mountSingleChild(item.exe())); break;
            case 'builder':
                frag.appendChild(transformBuilderToDom(item)); break;
            case 'if':
            case 'switch':
            case 'for':
            case 'show':
            case 'model':
                frag.appendChild(item.exe()); break;
            case 'text':
                frag.appendChild(item.exeTextNode()); break;
        }
    }
    return frag;
}

function setNodeText (node: HTMLElement | Text, v: string) {
    if (isInputNode(node)) {
        (node as any).value = v;
    } else {
        node.appendChild(document.createTextNode(v));
    }
}

function isInputNode (node: HTMLElement | Text) {
    return typeof (node as any).value !== 'undefined' && (node as HTMLElement).tagName !== 'BUTTON';
}

function applyDomInfoReaction (
    isHTMLFilled: boolean,
    dom: HTMLElement,
    binding: IReactBinding,
    updated?: IUpdatedCallback
): {domInfo: IDomInfoData, children: TChild[]} {
    const children: TChild[] = [];
    const {template, reactions} = binding;
    const replacement = join(template, createReplacement);
    
    // const
    const info = parseDomInfo(replacement);

    const data: IDomInfoData = {};
    if (info.textContent) {
        if (isHTMLFilled) {
            console.warn('text is not supported in html or text builder');
        } else {
            const textContent = info.textContent;
            const results = extractReplacement(textContent);
            if (results) {
                if (isInputNode(dom)) {
                    (dom as any).value = reactiveTemplate(textContent, reactions, (content, oldContent) => {
                        (dom as any).value = content;
                        updated?.({node: dom, type: 'value', value: content, prevValue: oldContent});
                    }, false);
                } else {
                    const texts = textContent.split(ReplaceExp);
                    texts.forEach((text, i) => {
                        if (text) {
                            children.push(document.createTextNode(text));
                        }
                        if (!results[i]) return;
                        const index = parseReplacementToNumber(results[i]);
                        const reactionItem = reactions[index];
                        if (!reactionItem) return;
                        const reaction = transformToReaction(reactionItem);
                        // ! 关键代码
                        const node = document.createTextNode(
                            reaction[subscribe]((v, v2) => {
                                node.textContent = v;
                                updated?.({node, type: 'text', value: v, prevValue: v2});
                            })
                        );
                        children.push(node);
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
                children.push(text(textContent));
                // data.textContent = textContent;
            }
        }
    }

    if (info.className) {
        info.className.forEach(name => {
            if (!data.className) data.className = [];
            const value = reactiveTemplate(name, reactions, (content, oldContent) => {
                if (!oldContent) {
                    dom.classList.add(content);
                } else if (!content) {
                    dom.classList.remove(oldContent);
                } else {
                    dom.classList.replace(oldContent, content);
                }
                updated?.({node: dom, type: 'className', value: content, prevValue: oldContent});
            }, true);
            if (value)data.className.push(value);
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
                updated?.({node: dom, key, type: 'attribute-key', value: content, prevValue: oldContent});
            }, true);
            value = reactiveTemplate(info.attributes[k], reactions, (content, oldContent) => {
                dom.setAttribute(key, content);
                value = content;
                updated?.({node: dom, key, type: 'attribute-value', value: content, prevValue: oldContent});
            });
            if (!data.attributes) data.attributes = {};
            data.attributes[key] = value;
        }
    }

    if (info.id) {
        const id = reactiveTemplate(info.id, reactions, (content, oldContent) => {
            dom.id = content;
            updated?.({node: dom, type: 'id', value: content, prevValue: oldContent});
        });
        dom.id = id;
    }

    return {domInfo: data, children};
    // console.log(info, dom, binding, replacement, reactions);
}

export function createElement ({
    tag = '',
    className = [],
    id = '',
    textContent = '',
    attributes = {},
    children = [],
    binding = [],
    domInfo = {},
    event = [],
    _if,
    styles = [],
    pseudos = [],
    lifes = {},
    html,
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
        pseudos,
        lifes,
        html,
    };
}