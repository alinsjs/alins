/*
 * @Author: tackchen
 * @Date: 2022-10-18 09:52:03
 * @Description: Coding something
 */

import {
    isStringTemplateArray, splitTwoPart,
    subscribeReactBuilder, subscribe, transformToReaction,
    createReplacement, createTemplateReplacement, reactiveTemplate, ReplaceExp, computed,
} from 'alins-reactive';
import {IReactBuilder, TReactionItem, TReactionValue} from 'alins-utils/src/types/react.d';
import {IJson} from 'alins-utils/src/types/common.d';
import {IStyleAtoms, IStyleBuilder} from 'alins-utils/src/types/style.d';
import {DefaultUint, StyleAtoms} from './style-atom';

type TStyleJsonValue = IJson<TReactionValue<string|number>>
export interface IStyleConstructor extends IStyleAtoms{
    (json: TStyleJsonValue): IStyleBuilder;
    (ts: TemplateStringsArray, ...reactions: TReactionItem[]): IStyleBuilder;
    (style: string): IStyleBuilder;
}

export const OnlyNumberAttrs = ['zIndex', 'opacity', 'flex'];

export const style: IStyleConstructor = Object.assign((
    a1: TStyleJsonValue | TemplateStringsArray | string,
    ...reactions: TReactionItem[]
) => {
    return {
        // 返回响应模板和响应数据
        generate (start = 0) {
            let scopeTemplate = '';
            const scopeReactions: TReactionItem[] = [];
            if (typeof a1 === 'string') { // style('')
                scopeTemplate += a1; // 静态style
            } else if (isStringTemplateArray(a1)) { // style``
                const template = a1 as any as string[]; // 静态style
                if (reactions.length === 0) scopeTemplate += template[0]; // 没有响应数据
                else {
                    scopeTemplate += createTemplateReplacement(template, start);
                    scopeReactions.push(...reactions);
                }
            } else if (typeof a1 === 'object' || a1 !== null) { // json
                for (const key in a1) {
                    const value = (a1 as TStyleJsonValue)[key];
                    let styleValue = '';
                    const startIndex = scopeReactions.length + start;
                    if (typeof value === 'string') { // 当json值是简单类型
                        styleValue = transformStyleValue(key, value);
                    } else if ((value as IJson).type === 'react' ) {
                        // 当json值是IReactBuilder react`1-${xx}`
                        // 参数是reactBuilder的时候需要合并一下 reactions
                        const {template, reactions} = (value as IReactBuilder).exe({
                            type: 'style',
                        });
                        if (reactions.length > 0) {
                            styleValue = createTemplateReplacement(template, startIndex);
                            scopeReactions.push(...reactions);
                        } else {
                            styleValue = template.join('');
                        }
                    } else {
                        // 当json值是TReactionItem
                        let reaction = transformToReaction(value as TReactionItem<number | string>);
                        
                        if (needDefaultUnit(key, reaction.value)) {
                            const origin = reaction; // ! 如果需要使用默认单位 则这里进行一次computed加上单位
                            reaction = computed(() => origin.value + DefaultUint);
                        }
                        styleValue = createReplacement(startIndex);
                        scopeReactions.push(reaction);
                    }
                    scopeTemplate += `${transformStyleAttr(key)}:${styleValue};`;
                }
            } else {
                console.warn('Invalid style arguments', a1, reactions);
                return {scopeTemplate: '', scopeReactions: []};
            }
            // 交给外部处理
            return {
                scopeTemplate,
                scopeReactions
            };
        },
        exe (dom: HTMLElement) {
            const beforeStyle = dom.getAttribute('style') || '';
            let newStyle = beforeStyle;
            if (typeof a1 === 'string') {
                newStyle += a1; // 静态style
            } else if (isStringTemplateArray(a1)) {
                const template = a1 as any as string[]; // 静态style
                if (reactions.length === 0) {// 没有响应数据
                    newStyle += template[0]; // 静态style
                } else {
                    const templateRep = createTemplateReplacement(template);
                    const [styles, reactStyles] = parseStyleTemplateToObject(templateRep);
                    newStyle += styles;
                    newStyle += reactiveStyle(dom.style as any, reactStyles, reactions);
                }
            } else if (typeof a1 === 'object' || a1 !== null) { // json
                const style = dom.style as any as IJson<string>;
                for (const key in a1) {
                    const value = (a1 as TStyleJsonValue)[key];
                    let styleValue: string|number = '';
                    if (typeof value === 'string' || typeof value === 'number') { // 当json值是简单类型
                        styleValue = transformStyleValue(key, value);
                    } else if ((value as IJson).type === 'react' ) {
                        // 当json值是IReactBuilder react`1-${xx}`
                        styleValue = subscribeReactBuilder(value as IReactBuilder, (content) => {
                            setDomStyle(style, key, content);
                        }, 'style');
                    } else {
                        // 当json值是TReactionItem
                        const reaction = transformToReaction(value as TReactionItem<number | string>);
                        styleValue = reaction[subscribe](v => {
                            setDomStyle(style, key, v);
                        });
                    }
                    newStyle += `${transformStyleAttr(key)}:${transformStyleValue(key, styleValue)};`;
                }
            } else {
                console.warn('Invalid style arguments');
            }
            dom.setAttribute('style', newStyle);
        },
        mount (dom: HTMLElement|string) {
            if (typeof dom === 'string') dom = document.querySelector(dom) as HTMLElement;
            if (!dom) throw new Error('invalid dom');
            this.exe(dom);
        },
        type: 'style' as 'style',
    };
}, StyleAtoms);

export function transformStyleAttr (name: string) {
    return name.replace(/[A-Z]/g, i => '-' + i.toLowerCase());
}

export function transformStyleValue (key: string, v: string|number) {
    return v + (needDefaultUnit(key, v) ? DefaultUint : '');
}

function needDefaultUnit (k: string, v: any) {
    return typeof v === 'number' && !OnlyNumberAttrs.includes(k);
}

// aaa; aaa$$0$$;
function parseStyleTemplateToObject (templateRep: string): [string, IJson<string>] {
    const lines = templateRep.split(/[;\n]/);
    let styles: string = '';
    const reactStyles: IJson<string> = {};
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) continue;
        const [key, value] = splitTwoPart(line, ':');
        if (!value) continue;
        const styleKey = transformStyleAttr(key);
        if (ReplaceExp.test(line)) {
            reactStyles[key] = value;
        } else {
            styles += `${styleKey}:${value};`;
        }
    }
    return [styles, reactStyles];
}

function reactiveStyle (style: IJson<string>, styles: IJson<string>, reactions: TReactionItem[]) {
    let styleStr = '';
    for (const k in styles) {
        let value = '';
        let key = reactiveTemplate(k, reactions, (content, oldContent) => {
            style[oldContent] = '';
            setDomStyle(style, content, value);
            key = content;
        }, true);
        value = reactiveTemplate(styles[k], reactions, (content) => {
            setDomStyle(style, key, content);
            value = content;
        });
        styleStr += concatStyleValue(key, value);
    }
    return styleStr;
}

function setDomStyle (style: IJson<string>, key: string, value: number | string) {
    // console.log(key, transformStyleValue(key, value));
    style[key] = transformStyleValue(key, value);
}

function concatStyleValue (key: string, value: number | string) {
    return `${transformStyleAttr(key)}:${transformStyleValue(key, value)};`;
}