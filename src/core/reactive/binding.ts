/*
 * @Author: tackchen
 * @Date: 2022-10-12 14:22:03
 * @Description: Coding something
 */
import {TInfoType} from '../parser/info-parser';
import {join} from '../utils';
import {IReactBinding, IReactItem, subscribe} from './react';

export const ReplaceExp = /\$\$\d+\$\$/;
export const ReplaceExpG = /\$\$\d+\$\$/g;

export function createReplacement (i: number) {
    return `$$${i}$$`;
}
export function extractReplacement (str: string): null | string[] {
    const results = str.match(ReplaceExpG);
    if (!results) return null;
    return results;
}

export function bindReactiveToDom ({
    type,
    dom,
    value,
    binding
}: {
    type: TInfoType,
    dom: HTMLElement,
    value: string,
    binding: IReactBinding,
}) {
    const results = extractReplacement(value);
    if (!results) {
        return value;
    }
}

export function parseReplacementToNumber (replacement: string): number {
    return parseInt(replacement.replace(/\$\$/g, ''));
}

export function reactiveTemplate (
    template: string,
    reactions: IReactItem[],
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
            return reactions[index][subscribe]((value) => {
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