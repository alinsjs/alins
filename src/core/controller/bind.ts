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

import {type} from 'os';
import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {IBuilderParameter} from '../core';
import {IElementBuilder, transformBuilderToDom} from '../element/transform';
import {computed} from '../reactive/computed';
import {IReactItem, subscribe, transformToReaction} from '../reactive/react';
import {TIfArg} from './if';

export type TBindArg = IReactItem<any> | (()=>any);

export interface IBindBuilder extends IBuilderParameter {
    exe(): HTMLElement;
    type: 'bind';
}


export interface IBindController {
    (
        this: IBuilderConstructor,
        value: TBindArg,
        isNumber?: boolean,
    ): ((...args: TBuilderArg[]) => IBindBuilder);
}

// div.if(num.value > 1)(react`:${bool}`),
// div.if(bool)(react`:${num.value}`),

export const bindController: IBindController = function (this: IBuilderConstructor, value, isNumber = false) {
    const react = transformToReaction(value);
    const constructor = this;
    return (...args) => {
        return {
            exe () {
                let isInput = false;
                const builder = constructor.apply(null, args);
                const dom = transformBuilderToDom(builder) as HTMLInputElement;

                const isCEDom = (dom.contentEditable === 'true');

                const getValue = isCEDom ? () => dom.textContent || '' : () => dom.value || '';
                const setValue = isCEDom ? (v: string) => {dom.textContent = v;} : (v: string) => {dom.value = v;};

                setValue(react[subscribe](v => {
                    if (isInput) {
                        isInput = false;
                        return;
                    }
                    setValue(v);
                }));
                dom.addEventListener('input', () => {
                    isInput = true;
                    const v = getValue();
                    react.set(isNumber ? parseFloat(v) : v);
                }, false);
                return dom;
            },
            type: 'bind'
        };
    };
};