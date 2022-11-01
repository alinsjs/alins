/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:32:24
 * @Description: Coding something
 */

import {controllers, IControllers} from '../controller/controller';
import {IEventBuilder} from '../event/on';
import {createElement, IElement, IElementBuilder, IElementOptions, TChild} from '../element/transform';
import {countBindingValue} from 'alins-reactive';
import {IReactBinding, IReactBuilder} from 'alins-utils/src/types/react.d';
import {IJson} from 'alins-utils/src/types/common';
import {ILifeBuilder, ILifes} from './life';
import {mount} from '../mount';

export type TBuilderArg = number | string | IReactBuilder | IEventBuilder | TChild | IBuildFunction | ILifeBuilder; // (IElementBuilder|IElementBuilder[])[];

export type IBuildFunction = () => TBuilderArg[];
export interface IBuilder extends IControllers, IBuilderConstructor {
    // todo controller
}

function getTagNameFromDomInfo (domInfo: string) {
    if (domInfo[0] !== '/') return '';
    for (let i = 1; i < domInfo.length; i++) {
        if ('.#[:'.includes(domInfo[i])) return domInfo.substring(1, i);
    }
    return domInfo.substring(1);
}

/**
 * dom builder 是div等函数的返回值
 * 在执行mount的时候的会动态的执行 返回一个 IElement对象
 * 然后通过 transform 方法转正真实dom节点
 */
function elementBuilder (tag: string, data: TBuilderArg[]) {
    // console.log('elementBuilder', tag, data, JSON.stringify(data));
    const elementOptions: IElementOptions & {
        children: TChild[],
        binding: IReactBinding[],
        lifes: ILifes,
    } = {
        tag,
        children: [],
        event: [],
        binding: [],
        styles: [],
        pseudos: [],
        domInfo: '',
        lifes: {},
    };
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (typeof item === 'string') {
            // dom info
            const tagName = getTagNameFromDomInfo(item);
            if (tagName) elementOptions.tag = tagName;
            elementOptions.domInfo += item;
        } else if (item instanceof Array) {
            // append children
            elementOptions.children.push(item);
        } else if (typeof item === 'object' && item) {
            switch (item.type) {
                case 'react':
                    const binding = item.exe({type: 'dom-info'});
                    if (binding.template[0][0] === '/') {
                        const domInfo = countBindingValue(binding);
                        elementOptions.tag = getTagNameFromDomInfo(domInfo);
                    }
                    elementOptions.binding.push(binding); // todo maybe other binding
                    break;
                case 'builder':
                case 'if':
                case 'show':
                case 'model':
                case 'switch':
                case 'for':
                case 'comp':
                    elementOptions.children.push(item); break;
                case 'on':
                    elementOptions.event?.push(item); break;
                case 'style':
                    elementOptions.styles?.push(item); break;
                case 'pseudo':
                    elementOptions.pseudos?.push(item); break;
                case 'life':
                    elementOptions.lifes[item.name] = item; break;
                default: console.warn('unkonwn builder', item); break;
            }
        } else if (typeof item === 'function') {
            const result = item();
            if ((result as any).type === 'model') { // model
                elementOptions.children.push((result as any).exe());
            } else {
                data.push(...result);
            }
        }
    }
    return createElement(elementOptions);
};


export interface IBuilderConstructor extends IControllers {
    (...args: TBuilderArg[]): IElementBuilder;
}

export function buildFactory (tag: string): IBuilderConstructor {
    return Object.assign(((...data: TBuilderArg[]) => {
        // todo exe add context
        return createBaseBuilder(() => {
            return elementBuilder(tag, data);
        });
    }), controllers);
}

export const dom = buildFactory;

const MainDomNames = [
    'a', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'canvas', 'code', 'pre', 'table', 'th', 'td', 'tr', 'video', 'audio',
    'ol', 'select', 'option', 'p', 'i', 'iframe', 'img', 'input', 'label', 'ul', 'li', 'span', 'textarea', 'form', 'br', 'tbody'
] as const;

const DomNames = [
    ...MainDomNames,
    'abbr', 'article', 'aside', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'caption', 'cite', 'del', 'details', 'dialog',
    'em', 'embed', 'figure', 'footer', 'header', 'hr', 'menu', 'nav', 'noscript',
    'object', 'progress', 'section', 'slot', 'small', 'strong', 'sub', 'summary', 'sup', 'template',
    'title', 'var',
] as const;

export const doms = (() => {
    const map: IJson<any> = {};
    DomNames.map(name => {
        map[name] = buildFactory(name);
    });
    return map as {
        [name in (typeof DomNames)[number]]: IBuilderConstructor;
    };
})();

export const [
    a, div, h1, h2, h3, h4, h5, h6, button, canvas, code, pre, table,
    th, td, tr, video, audio, ol, select, option, p, i, iframe, img,
    input, label, ul, li, span, textarea, form, br, tbody
] = MainDomNames.map(name => doms[name]);

function createBaseBuilder (exe: ()=> IElement): IElementBuilder {
    return {
        exe,
        type: 'builder',
        mount (parent: string | HTMLElement = 'body') {
            mount(parent, this);
        }
    };
}


// /*
//  * @Author: tackchen
//  * @Date: 2022-10-14 07:52:39
//  * @Description: Coding something
//  */

// export type TFPMemo = ReturnType<typeof createFuncProcessMemo>

// export const memorizeFuncReturn = () => {
// };

// export function createFuncProcessMemo<
//     F extends (args: any) => any
// > () {
    
//     let map: Function[] = [];

//     let scope: any[] = [];

//     let instance = {
//         add (fn: Function) {
//             map.push(fn);
//         },
//         scope (i: number) {return scope[i];},
//         last: null as any,
//         exe (args: any): ReturnType<F> | null {
//             if (map.length === 0) return null;
//             scope.length = 0;
//             for (let i = 0; i < map.length; i++) {
//                 const result = map[i](args) as any;
//                 scope[i] = result;
//                 this.last = result;
//             }
//             return scope[scope.length - 1] as ReturnType<F>;
//         },
//         destory () {
//             (map as any) = null;
//             (scope as any) = null;
//             (instance as any) = null;
//         }
//     };

//     return instance;
// };

// // export const