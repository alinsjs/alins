/*
 * @Author: tackchen
 * @Date: 2022-10-22 21:02:32
 * @Description: Coding something
 */

import {TReactionItem} from 'alins-utils/src/types/react.d';
import {reactiveTemplate} from 'alins-reactive';
import {IStyleAtoms, IStyleBuilder} from 'alins-utils/src/types/style.d';

type ICssCBArg = string | IStyleBuilder | IStyleAtoms | ICssCBArg[];

export interface ICssCallback {
    (...args: ICssCBArg[]): {
        style: HTMLStyleElement;
        mount(selector?: string | HTMLElement): void;
    };
}

export interface ICssConstructor {
    (selector: string): ICssCallback;
}

export const css: ICssConstructor = (selector: string) => {
    return (...args: ICssCBArg[]) => {
        const style = document.createElement('style');
        const {template, reactions} = buildCssFragment(selector, args);
        let content = '';
        if (reactions.length > 0) { // 有响应数据需要渲染
            content = reactiveTemplate(template, reactions, (content) => {
                style.innerText = content;
            });
        } else {
            content = template;
        }
        style.innerText = content;
        return {
            style,
            mount (selector = 'head') {
                let parent: HTMLElement | null;
                if (typeof selector === 'string') {
                    parent = document.querySelector(selector);
                } else {
                    parent = selector;
                }
                if (!parent) throw new Error('Invalid mount target');

                parent.appendChild(style);
            }
        };
    };
};

function buildCssFragment (
    selector: string,
    args: ICssCBArg[],
    path = '',
    reactions: TReactionItem[] = []
): {
    template: string,
    reactions: TReactionItem[],
} {
    const selectorPath = concatSelectorPath(path, selector);
    let childStyles = '';

    let currentStyle = '';

    for (const item of args) {
        if (typeof item === 'string') {
            currentStyle += item + ';'; // css 静态样式
        } else if (item instanceof Array) { // 子类
            const result = buildCssFragment(item[0] as string, item.slice(1), selectorPath, reactions);
            childStyles += result.template;
            reactions.push(...result.reactions);
        } else if (typeof item === 'object') { // style(...)
            const {scopeReactions, scopeTemplate} = item.generate(reactions.length);
            currentStyle += scopeTemplate;
            reactions.push(...scopeReactions);
        }
    }

    return {
        template: `${selectorPath}{${currentStyle}}${childStyles}`,
        reactions,
    };
}

function concatSelectorPath (path: string, name: string) {
    if (name[0] === '&') {
        return `${path}${name.substring(1)}`;
    } else {
        return `${path} ${name}`;
    }
}
