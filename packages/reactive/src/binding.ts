/*
 * @Author: tackchen
 * @Date: 2022-10-12 14:22:03
 * @Description: Coding something
 */

import {IJson} from 'alins-utils/src/types/common.d';
import {TReactionItem} from 'alins-utils/src/types/react.d';
import {join, subscribe} from 'alins-utils';
import {transformToReaction} from './react';

export const ReplaceExp = /\$\$\d+\$\$/;
export const ReplaceExpG = /\$\$\d+\$\$/g;

const ReplacementMap: string[] = [];
const ReplacementMapReverse: IJson<number> = {};

export function createReplacement (i: number) {
    if (ReplacementMap[i]) return ReplacementMap[i];
    const str = `$$${i}$$`;
    ReplacementMap[i] = str;
    ReplacementMapReverse[str] = i;
    return str;
}

export function parseReplacementToNumber (replacement: string): number {
    return ReplacementMapReverse[replacement] || parseInt(replacement.replace(/\$\$/g, ''));
}

export function extractReplacement (str: string): null | string[] {
    const results = str.match(ReplaceExpG);
    if (!results) return null;
    return results;
}

export function createTemplateReplacement (template: string[], start = 0) {
    return join(template, (i) => createReplacement(i + start));
}

// 传入模板和reaction callback传回每次更新渲染的新值
// template = 'aaa$$0$$aaa'
// 初次会返回首次渲染的值
export function reactiveTemplate (
    templateRep: string,
    reactions: TReactionItem[],
    callback: (
        content: string,
        oldContent: string,
    ) => void,
    needOldContent = false,
    // valueHandle?: <T=any>(value: T) => T,
) {
    if (reactions.length === 0) return templateRep;
    const results = extractReplacement(templateRep);
    if (results) {
        const texts = templateRep.split(ReplaceExp);
        const filler: string[] = results.map((item, i) => {
            const index = parseReplacementToNumber(item);
            const reaction = transformToReaction(reactions[index]);
            return reaction[subscribe]((value) => {
                // if (valueHandle) debugger;
                const oldContent = needOldContent ? join(texts, filler) : '';
                filler[i] = value;
                const newContent = join(texts, filler);
                callback(newContent, oldContent);
                
                // const oldClass = join(texts, filler);
                // filler[i] = value;
                // dom.classList.replace(oldClass, join(texts, filler));
            });
        });
        return join(texts, filler);
    }
    return templateRep;
}