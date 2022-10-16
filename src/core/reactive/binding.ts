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
    const results = extractReplacement(template); // 占位符
    // ["$$0$$", "$$1$$"]
    if (results) {
        const texts = template.split(ReplaceExp); // 静态文本
        // 填充进静态文本之间的填充物

        const createFiller = (reactions: IReactItem[], dom: HTMLElement) => {
            return results.map((item, i) => {
                // 提取占位符中的index 表示实际以来的reactions下标
                const index = parseReplacementToNumber(item);
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
        };

        const filler: string[] = createFiller(reactions, dom);

        const defaultContent = join(texts, filler);
        memo.add((config: IElement) => {
            const reactions = (config.binding as any).reactions as IReactItem[];
            const dom = memo?.last;
            const filler = createFiller(reactions, dom);
            callback(dom, join(texts, filler), defaultContent); // 初始化class
            return dom;
        });
        return defaultContent;
    }
    return template;
}
