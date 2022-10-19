/*
 * @Author: tackchen
 * @Date: 2022-10-12 14:22:03
 * @Description: Coding something
 */
import {IJson} from '../common';
import {join} from '../utils';
import {subscribe, transformToReaction, TReactionItem} from './react';

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

export function reactiveTemplate (
    template: string,
    reactions: TReactionItem[],
    callback: (
        content: string,
        oldContent: string,
    ) => void,
    needOldContent = false,
) {
    const results = extractReplacement(template);
    if (results) {
        const texts = template.split(ReplaceExp);
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
    return template;
}