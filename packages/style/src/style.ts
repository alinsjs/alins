/*
 * @Author: tackchen
 * @Date: 2022-10-18 09:52:03
 * @Description: Coding something
 */

import {
    isStringTemplateArray, splitTwoPart, createTemplateReplacement, reactiveTemplate,
    ReplaceExp, computed,
} from 'alins-reactive';
import {TReactionItem, TReactionValue} from 'alins-utils/src/types/react.d';
import {IJson} from 'alins-utils/src/types/common.d';
import {IStyleAtoms, IStyleBuilder} from 'alins-utils/src/types/style.d';
import {DefaultUint, StyleAtoms} from './style-atom';
import {countBindingValue, exeReactionValue, parseReactionValue} from 'alins-reactive/src/react';

type TStyleJsonValue = IJson<TReactionValue<string|number>>
export interface IStyleConstructor extends IStyleAtoms{
    (json: TStyleJsonValue): IStyleBuilder;
    (ts: TemplateStringsArray, ...reactions: TReactionItem[]): IStyleBuilder;
    (style: string): IStyleBuilder;
}

export const OnlyNumberAttrs = ['zIndex', 'opacity', 'flex', 'flexGrow', 'flexShrink'];

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
                if (reactions.length === 0) {
                    scopeTemplate += template[0]; // 没有响应数据
                } else {
                    scopeTemplate += createTemplateReplacement(template, start);
                    scopeReactions.push(...reactions);
                }
            } else if (typeof a1 === 'object' || a1 !== null) { // json
                for (const key in a1) {

                    const {reactions, template} = parseReactionValue(
                        (a1 as TStyleJsonValue)[key],
                        scopeReactions.length + start,
                        (v) => transformStyleValue(key, v),
                        (reaction) => needDefaultUnit(key, reaction.value) ?
                            computed(() => reaction.value + DefaultUint) :
                            reaction
                    );

                    if (reactions.length > 0) scopeReactions.push(...reactions);
                    scopeTemplate += `${transformStyleAttr(key)}:${template};`;
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
                    const styleValue: string|number = exeReactionValue(
                        (a1 as TStyleJsonValue)[key],
                        (content) => {setDomStyle(style, key, content);}
                    );
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
        react () {
            const {scopeReactions, scopeTemplate} = this.generate();
            const template = scopeTemplate.split(ReplaceExp);
            return () => countBindingValue({
                template, reactions: scopeReactions
            });
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
