/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:32:24
 * @Description: Coding something
 */

import {controllers, IControllers} from '../controller/controller';
import {IEventBuilder} from '../event/on';
import {createElement} from '../element/transform';
import {countBindingValue} from 'alins-reactive';
import {
    IComputedItem, IReactBinding, IReactBuilder, IReactItem, TReactionItem,
    IBuilderParameter, IJson, IStyleBuilder, IStyleAtoms, IPseudoBuilder,
} from 'alins-utils';
import {ILifeBuilder, ILifes} from './life';
import {mountParentWithTChild} from '../mount';
import {IHTMLBuilder} from './html';
import {checkDefaultTextItem, getTagNameFromDomInfo} from '../parser/info-parser';
import {IComponentBuilder} from '../comp/comp';
import {IModelBuilder} from '../controller/model';
import {IIfBuilder} from '../controller/if';
import {IShowBuilder} from '../controller/show';
import {ISwitchBuilder} from '../controller/switch';
import {IForBuilder} from '../controller/for';
import {ITextBuilder} from './text';

export type TElementChild = null | HTMLElement | IElementBuilder | IComponentBuilder |
    IForBuilder | IIfBuilder<any> | IShowBuilder |
    IModelBuilder | ISwitchBuilder<any, any> | (()=>TElementChild) | TElementChild[];

export type TChild = TElementChild |
    IStyleBuilder | IStyleAtoms | IPseudoBuilder | TChild[];

export interface IElement {
    tag: string;
    className: string[];
    id: string;
    textContent: string;
    attributes: IJson<string>;
    children?: TChild[];
    binding: IReactBinding[];
    event: IEventBuilder[];
    domInfo: string;
    _if?: IIfBuilder<any>;
    show?: TReactionItem;
    styles: (IStyleBuilder | IStyleAtoms)[];
    pseudos: IPseudoBuilder[];
    lifes: ILifes;
    html?: IHTMLBuilder;
    text?: ITextBuilder;
}

export type IElementOptions = Partial<IElement>

export interface IElementBuilder extends IMountBuilderParameter {
    type: 'builder'; // todo comp
    exe(): IElement;
    _asParent(builders: TBuilderArg[]): void;
}

export type IMountParent = string | HTMLElement | IComponentBuilder | IElementBuilder;

export interface IMountBuilderParameter extends IBuilderParameter {
    mount(parent?: IMountParent): void;
}

export type TBuilderArg = IReactItem<any> | IComputedItem<any> | number | string | IReactBuilder |
    IEventBuilder | TChild | IBuildFunction | ILifeBuilder |
    IHTMLBuilder | ITextBuilder; // (IElementBuilder|IElementBuilder[])[];

export type IBuildFunction = () => TBuilderArg|TBuilderArg[];
export interface IBuilder extends IControllers, IBuilderConstructor {
}

/**
 * dom builder ???div?????????????????????
 * ?????????mount?????????????????????????????? ???????????? IElement??????
 * ???????????? transform ??????????????????dom??????
 */
function elementBuilder (tag: string, data: TBuilderArg[]) {
    // console.log('elementBuilder', tag, data, JSON.stringify(data));
    const elementOptions: IElementOptions & {
        children: TElementChild[],
        binding: IReactBinding[],
        lifes: ILifes,
        textContent: string,
    } = {
        tag,
        children: [],
        event: [],
        binding: [],
        styles: [],
        pseudos: [],
        domInfo: '',
        lifes: {},
        textContent: ''
    };
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (typeof item === 'number') {
            elementOptions.textContent += item;
        } else if (typeof item === 'string') {
            // dom info
            const tagName = getTagNameFromDomInfo(item);
            if (tagName) elementOptions.tag = tagName;
            elementOptions.domInfo += checkDefaultTextItem(item);
        } else if (item instanceof Array || item instanceof HTMLElement) {
            // append children
            elementOptions.children.push(item);
        } else if (typeof item === 'object' && item) {
            switch (item.type) {
                case 'reaction':
                    // ????????????????????? reaction??? ????????????binding
                    elementOptions.binding.push({
                        template: ['', ''],
                        reactions: [item],
                        context: {type: 'dom-info'},
                    });
                    break;
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
                case 'html':
                    elementOptions.html = item; break;
                case 'text':
                    elementOptions.text = item; break;
                default: console.warn('unkonwn builder', item); break;
            }
        } else if (typeof item === 'function') {
            const result = item() as any;
            const type = result.type;
            // ! ?????????????????????
            switch (type) {
                case 'builder':
                case 'if':
                case 'show':
                case 'switch':
                case 'for':
                case 'comp':
                    elementOptions.children.push(result as TChild); break;
                case 'model':
                    // todo comp ??????????????????????????????????????????
                    // ?????????????????????????????? input.model(num); = input.model(num)();
                    elementOptions.children.push(result.exe()); break;
                default: {
                    // ! ???????????????????????? ????????????
                    if (result instanceof Array) {
                        data.splice(i, 1, ...result);
                    } else {
                        data.splice(i, 1, result);
                    }
                    i--;
                };
            }
        }
    }
    return createElement(elementOptions);
};


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

export type TDomName = typeof DomNames[number];

export interface IBuilderConstructor extends IControllers {
    (...args: TBuilderArg[]): IElementBuilder;
}

// ! ?????????????????? ??????????????????????????????
export function buildFactory (tag: TDomName): IBuilderConstructor;
export function buildFactory (tag: string): IBuilderConstructor;
export function buildFactory (tag: TDomName | string): IBuilderConstructor {
    return Object.assign(((...data: TBuilderArg[]) => {
        // todo exe add context
        return createBaseBuilder(data, () => {
            return elementBuilder(tag, data);
        });
    }), controllers);
}

export const dom = buildFactory;


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

function createBaseBuilder (args: TBuilderArg[], exe: ()=> IElement): IElementBuilder {
    return {
        exe,
        type: 'builder',
        mount (parent: IMountParent = 'body') {
            mountParentWithTChild(parent, this);
        },
        _asParent (builders: TBuilderArg[]) {
            args.push(...builders);
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