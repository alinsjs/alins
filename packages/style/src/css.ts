/*
 * @Author: tackchen
 * @Date: 2022-10-22 21:02:32
 * @Description: Coding something
 */

import {TReactionItem} from 'alins-utils/src/types/react.d';
import {IStyleAtoms, IStyleBuilder} from 'alins-utils/src/types/style.d';
import {reactiveTemplate} from 'alins-reactive';

export type ICssBase = string | IStyleBuilder | IStyleAtoms;

type ICssCBArg = ICssBase | ICssCBArg[];

export interface ICssCallback {
    (...args: ICssCBArg[]): {
        reactiveStyle(setStyle: (v:string) => void): void;
        mount(selector?: string | HTMLElement): void;
    };
}

export interface ICssConstructor {
    (selector: string): ICssCallback;
}

const supporteAdoptedStyle = typeof window.document.adoptedStyleSheets !== 'undefined' && !!window.CSSStyleSheet;

export const css: ICssConstructor = (selector: string) => {
    return (...args: ICssCBArg[]) => {
        const reactiveStyle = (setStyle: (v:string)=>void) => {
            const {template, reactions} = buildCssFragment(selector, args);
            if (reactions.length > 0) { // 有响应数据需要渲染
                setStyle(reactiveTemplate(template, reactions, setStyle));
            } else {
                setStyle(template);
            }
        };
        if (supporteAdoptedStyle) {
            const style = new CSSStyleSheet();
            reactiveStyle((v) => {style.replaceSync(v);});
        }
        return {
            reactiveStyle,
            mount (selector) {
                let parent: HTMLElement | null = null;
                if (selector) {
                    parent = typeof selector === 'string' ? document.querySelector(selector) : selector;
                    if (!parent) throw new Error('Invalid mount target');
                }
                return reactiveStyle(insertStyle(parent));
            }
        };
    };
};

export function insertStyle (parent?: HTMLElement | null) {
    if (parent) {
        return insertHTMLStyle(parent);
    } else if (supporteAdoptedStyle) {
        const style = new CSSStyleSheet();
        document.adoptedStyleSheets.push(style);
        return (v: string) => {style.replace(v);};
    } else {
        return insertHTMLStyle(document.head);
    }
}

function insertHTMLStyle (parent: HTMLElement) {
    const style = document.createElement('style');
    parent.appendChild(style);
    return (v: string) => {style.textContent = v;};
}

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
