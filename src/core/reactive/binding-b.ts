/*
 * @Author: tackchen
 * @Date: 2022-10-12 14:22:03
 * @Description: Coding something
 */
import {IJson} from '../common';
import {IElement} from '../element/transform';
import {TFPMemo} from '../memorize/memorize';
import {join} from '../utils';
import {forceUpdata, IReactItem, subscribe} from './react';

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
    memo: TFPMemo,
    dom: HTMLElement,
    template: string,
    reactions: IReactItem[],
    callback: (
        dom: HTMLElement,
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
            memo.add((config: IElement) => {
                const reactions = (config.binding as any).reactions as IReactItem[];
                const dom = memo?.last;
                const _filler = filler.slice();
                reactions[index][subscribe]((value: any) => {
                    const oldContent = needOldContent ? join(texts, _filler) : '';
                    _filler[i] = value;
                    const newContent = join(texts, _filler);
                    callback(dom, newContent, oldContent);
                    // const oldClass = join(texts, filler);
                    // filler[i] = value;
                    // dom.classList.replace(oldClass, join(texts, filler));
                });
                reactions[index][forceUpdata]();
                return dom;
            });
            return reactions[index][subscribe]((value) => {
                const oldContent = needOldContent ? join(texts, filler) : '';
                filler[i] = value;
                const newContent = join(texts, filler);
                callback(dom, newContent, oldContent);
                // const oldClass = join(texts, filler);
                // filler[i] = value;
                // dom.classList.replace(oldClass, join(texts, filler));
            });

        });
        return join(texts, filler);
    }
    return template;
}