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

function createReplacementArray (length: number) {
    if (length <= 0) return [];
    const arr = [];
    for (let i = 0; i < length; i++)
        arr.push(createReplacement(i));
    return arr;
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
    template: string | (string[]),
    reactions: TReactionItem[],
    callback: (
        content: string,
        oldContent: string,
    ) => void,
    needOldContent = false,
): string {
    const isArray = template instanceof Array;
    if (reactions.length > 0) {
        const results = isArray ? createReplacementArray(reactions.length) : extractReplacement(template);
        if (results) {
            const texts = isArray ? template : template.split(ReplaceExp);
            const filler: string[] = results.map((item, i) => {
                const index = parseReplacementToNumber(item);
                const reaction = transformToReaction(reactions[index]);
                return reaction[subscribe]((value) => {
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
    }
    return isArray ? template.join('') : template;
}