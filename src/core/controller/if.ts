/*
 * @Author: tackchen
 * @Date: 2022-10-15 19:53:12
 * @Description: Coding something
 */
/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {IBuilderParameter} from '../core';
import {IElementBuilder, transformBuilderToDom} from '../element/transform';
import {computed} from '../reactive/computed';
import {IReactItem, IReactWrap, subscribe} from '../reactive/react';

type TIfArg = IReactItem<boolean> | (()=>boolean);

export interface IIfBuilder extends IBuilderParameter{
    elif: IElseIf;
    else: IElse;
    onUpdate(fn: (dom: Node|HTMLElement)=>void): void;
    exe(): Node|HTMLElement;
    type: 'if';
}

interface IElseIf {
    (bool: TIfArg): ((...args: TBuilderArg[]) => IIfBuilder);
}
interface IElse{
    (...args: TBuilderArg[]): IIfBuilder;
}

export interface IIfController {
    (
        this: IBuilderConstructor,
        bool: TIfArg,
    ): ((...args: TBuilderArg[]) => IIfBuilder);
}

// div.if(num.value > 1)(react`:${bool}`),
// div.if(bool)(react`:${num.value}`),

export const ifController: IIfController = function (this: IBuilderConstructor, bool) {
    const changeList: Function[] = [];
    const node = document.createComment('');

    let elseBuilder: null | IElementBuilder = null;

    const builders: IElementBuilder[] = [];

    const pushBuilder = (args: TBuilderArg[], isElse = false) => {
        const builder = this.apply(null, args) as IElementBuilder;
        if (isElse) elseBuilder = builder;
        else builders.push(builder);
    };

    let activeIndex = 0;

    const exe = (start = 0) => {
        for (let i = start; i < reactList.length; i++) {
            if (reactList[i].get() === true) {
                activeIndex = i;
                return transformBuilderToDom(builders[i]);
            }
        }
        if (elseBuilder) {
            activeIndex = reactList.length;
            return transformBuilderToDom(elseBuilder);
        }
        activeIndex = -1;
        return node;
    };

    const reactList: IReactItem<boolean>[] = [];

    const pushReact = (bool: TIfArg) => {
        const i = reactList.length;
        const react = (typeof bool === 'function') ? computed(bool) : bool;
        react[subscribe](v => {
            let dom: HTMLElement | Node | null = null;
            if (v) {
                if (i < activeIndex || activeIndex === -1) {
                    activeIndex = i;
                    dom = transformBuilderToDom(builders[i]);
                }
            } else {
                dom = exe(activeIndex);
            }
            if (dom) changeList.forEach(fn => fn(dom));
        });
        reactList.push(react);
    };

    pushReact(bool);
    return (...args: TBuilderArg[]) => {
        pushBuilder(args);
        return {
            exe () {
                return exe();
            },
            elif (bool) {
                pushReact(bool);
                return (...args) => {
                    pushBuilder(args);
                    return this;
                };
            },
            else (...args) {
                pushBuilder(args, true);
                return this;
            },
            onUpdate (fn) {
                changeList.push(fn);
            },
            type: 'if'
        } as IIfBuilder;
    };
};