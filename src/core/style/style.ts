/*
 * @Author: tackchen
 * @Date: 2022-10-18 09:52:03
 * @Description: Coding something
 */

import {IJson} from '../common';
import {IBuilderParameter} from '../core';
import {IReactBinding, IReactBuilder, react, subscribe, transformToReaction, TReactionItem} from '../reactive/react';
import {createReplacement, createTemplateReplacement, reactiveTemplate, ReplaceExp} from '../reactive/binding';
import {isStringTemplateArray, splitTwoPart} from '../utils';
import {DefaultUint, IStyleAtoms, StyleAtoms} from './style-atom';


// const StyleAtoms = {
//     css: '',
//     borderBox () {
//         return '';
//     }
// };


export type TStyleReaction = IReactBuilder | TReactionItem<number | string>;

export interface IStyleBuilder extends IBuilderParameter{
    exe(parent: HTMLElement): string;
    // generateBindings(onchange: (onctent: string)=>void): string;
    generate(start?: number): {scopeTemplate: string, scopeReactions: TReactionItem[]};
    type: 'style';
}

export interface IStyleConstructor extends IStyleAtoms{
    (json: IJson<string | number | TStyleReaction>): IStyleBuilder;
    (ts: TemplateStringsArray, ...reactions: TReactionItem[]): IStyleBuilder;
    (style: string): IStyleBuilder;
}

const OnlyNumberAttrs = ['lineHeight', 'zIndex', 'opacity', 'flex'];

export const style: IStyleConstructor = Object.assign((
    a1: IJson<string | number | TStyleReaction> | TemplateStringsArray | string,
    ...reactions: TReactionItem[]
) => {
    return {
        // 返回响应模板和响应数据
        generate (start = 0) {
            let scopeTemplate = '';
            const scopeReactions: TReactionItem[] = [];
            if (typeof a1 === 'string') {
                scopeTemplate += a1; // 静态style
            } else if (isStringTemplateArray(a1)) {
                const template = a1 as any as string[]; // 静态style
                if (reactions.length === 0) scopeTemplate += template[0]; // 没有响应数据
                else {
                    scopeTemplate += createTemplateReplacement(template, start);
                    scopeReactions.push(...reactions);
                }
            } else if (typeof a1 === 'object' || a1 !== null) { // json
                for (const key in a1) {
                    const value = (a1 as IJson<string | number | TStyleReaction>)[key];
                    let styleValue = '';
                    if (typeof value === 'string') { // 当json值是简单类型
                        styleValue = transformStyleValue(key, value);
                    } else if ((value as IJson).type === 'react' ) {
                        // 当json值是IReactBuilder react`1-${xx}`
                        // 参数是reactBuilder的时候需要合并一下 reactions
                        const {template, reactions} = (value as IReactBuilder).exe({
                            type: 'style',
                        });
                        if (reactions.length > 0) {
                            styleValue = createTemplateReplacement(template, scopeReactions.length);
                            scopeReactions.push(...reactions);
                        } else {
                            styleValue = template.join('');
                        }
                    } else {
                        // 当json值是TReactionItem
                        const reaction = transformToReaction(value as TReactionItem<number | string>);
                        styleValue = createReplacement(scopeReactions.length);
                        scopeReactions.push(reaction);
                    }
                    scopeTemplate += `${transformStyleAttr(key)}:${styleValue};`;
                }
                // 交给外部处理
                return {
                    scopeTemplate,
                    scopeReactions
                };
            }
            console.warn('Invalid style arguments');
            return {scopeTemplate: '', scopeReactions: []};
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
                    const value = (a1 as IJson<string | number | TStyleReaction>)[key];
                    let styleValue: string|number = '';
                    if (typeof value === 'string' || typeof value === 'number') { // 当json值是简单类型
                        styleValue = transformStyleValue(key, value);
                    } else if ((value as IJson).type === 'react' ) {
                        // 当json值是IReactBuilder react`1-${xx}`
                        // 参数是reactBuilder的时候需要合并一下 reactions
                        const {template, reactions} = (value as IReactBuilder).exe({
                            type: 'style',
                        });
                        if (reactions.length > 0) {
                            const templateRep = createTemplateReplacement(template);
                            styleValue = reactiveTemplate(templateRep, reactions, (content) => {
                                setDomStyle(style, key, content);
                            });
                        } else {
                            styleValue = template.join('');
                        }
                    } else {
                        // 当json值是TReactionItem
                        const reaction = transformToReaction(value as TReactionItem<number | string>);
                        styleValue = reaction[subscribe](v => {
                            setDomStyle(style, key, v);
                        });
                    }
                    newStyle += `${transformStyleAttr(key)}:${transformStyleValue(key, styleValue)};`;
                }
            }
            console.warn('Invalid style arguments');
            dom.setAttribute('style', newStyle);
            return newStyle;
        },
        type: 'style' as 'style',
    };
}, StyleAtoms);

export function transformStyleAttr (name: string) {
    return name.replace(/[A-Z]/g, i => '-' + i.toLowerCase());
}

function transformStyleValue (key: string, v: string|number) {
    if (typeof v === 'string') return v;
    return v + (OnlyNumberAttrs.includes(key) ? '' : DefaultUint);
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
    console.log(key, transformStyleValue(key, value));
    style[key] = transformStyleValue(key, value);
}

function concatStyleValue (key: string, value: number | string) {
    return `${transformStyleAttr(key)}:${transformStyleValue(key, value)};`;
}