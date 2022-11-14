/*
 * @Author: tackchen
 * @Date: 2022-10-22 21:02:32
 * @Description: Coding something
 */

import {TReactionItem, IStyleComponent, IStyleComponentArray, IReactBuilder, IStyleBuilder, TStyleJsonValue} from 'alins-utils';
import {createTemplateReplacement, reactiveTemplate} from 'alins-reactive';
import {insertStyle} from './utils';
import {parseStyleTemplateToObject, style} from './style';
import {compateStaticStyle} from './style-func/style-compatiable';

export interface ICssCallback {
    (...args: IStyleComponentArray[]): {
        reactiveStyle(setStyle: (v:string) => void): void;
        mount(selector?: string | HTMLElement): void;
    };
}

export interface ICssConstructor {
    (selector?: string): ICssCallback;
}
export const css: ICssConstructor = (selector: string = '') => {
    return (...args: IStyleComponentArray[]) => {
        const reactiveStyle = (setStyle: (v:string)=>void) => {
            const {template, reactions} = buildCssFragment(selector, args);
            if (reactions.length > 0) { // 有响应数据需要渲染
                setStyle(reactiveTemplate(template, reactions, setStyle));
            } else {
                setStyle(template);
            }
        };
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

function buildCssFragment (
    selector: string,
    args: IStyleComponentArray[],
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
        if (item instanceof Array) { // 子类
            const result = buildCssFragment(item[0] as string, item.slice(1), selectorPath, reactions);
            childStyles += result.template;
            reactions.push(...result.reactions);
        } else {
            currentStyle += parseSingleCssItem(item, reactions);
        }
    }
    currentStyle = compateStaticStyle(currentStyle);

    return {
        template: !!selectorPath ? `${selectorPath}{${currentStyle}}${childStyles}` : `${currentStyle}${childStyles}`,
        reactions,
    };
}

export function parseSingleCssItem (item: IStyleComponent, reactions: TReactionItem[]) {
    let styleStr = '';
    if (typeof item === 'string') {
        styleStr = item; // css 静态样式
    } else if (typeof item === 'object') { // style(...)
        if (item.type === 'react') {
            const result = (item as IReactBuilder).exe({type: 'style'});
            const start = reactions.length;
            reactions.push(...result.reactions);
            styleStr = createTemplateReplacement(result.template, start);
        } else {
            if (item.type !== 'style') { // TStyleJsonValue
                item = style(item as TStyleJsonValue);
            }
            const {scopeReactions, scopeTemplate} = (item as IStyleBuilder).generate(reactions.length);
            reactions.push(...scopeReactions);
            styleStr = scopeTemplate;
        }
    }
    return parseStyleTemplateToObject<string>(styleStr, true);
}

function concatSelectorPath (path: string, name: string) {
    if (!path && !name) return '';
    if (name[0] === '&') {
        return `${path}${name.substring(1)}`;
    } else {
        return `${path} ${name}`;
    }
}
