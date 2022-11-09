/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: model controller
 */

import {IBuilderConstructor, IMountBuilderParameter, IMountParent, TBuilderArg} from '../builder/builder';
import {subscribe, transformToReaction} from 'alins-reactive';
import {IReactItem} from 'alins-utils';
import {transformBuilderToDom} from '../element/transform';
import {mountParentWithTChild} from '../mount';

export type TModelArg<T> = IReactItem<T> | (()=>T);

export interface IModelBuilder extends IMountBuilderParameter {
    exe(): HTMLElement;
    type: 'model';
}

type TModelDecorator = 'number' | 'camel';

interface IModelBuilderReturn extends IModelBuilder {
    (...args: TBuilderArg[]): IModelBuilder;
}

export interface IModelController {
    <T>(
        this: IBuilderConstructor,
        value: TModelArg<T>,
        ...decorators: TModelDecorator[]
    ): IModelBuilderReturn;
}

export const modelController: IModelController = function (this: IBuilderConstructor, value, ...decorators) {
    const react = transformToReaction(value);
    const constructor = this;
    const result: IModelBuilderReturn = (...args) => {
        return {
            exe () {
                let isInput = false;
                const builder = constructor.apply(null, args);
                const dom = transformBuilderToDom(builder) as HTMLInputElement;

                const isCEDom = (dom.contentEditable === 'true');

                const getValue = isCEDom ? () => dom.textContent || '' : () => dom.value || '';
                const setValue = isCEDom ? (v: any) => {dom.textContent = v;} : (v: string) => {dom.value = v;};

                setValue(react[subscribe]((v) => {
                    if (isInput) {
                        isInput = false;
                        return;
                    }
                    setValue(v);
                }));
                const triggerChange = (v: any) => {
                    isInput = true;
                    if (decorators.length !== 0) {
                        if (decorators.includes('number')) {
                            v = parseFloat(v);
                        } else if (decorators.includes('camel')) {
                            v = v.toLowerCase();
                        }
                    }
                    (react as IReactItem).value = v;
                };
                let isComposite = false;
                dom.addEventListener('compositionstart', () => {
                    isComposite = true;
                });
                dom.addEventListener('compositionend', () => {
                    isComposite = false;
                    triggerChange(getValue());
                });
                dom.addEventListener('input', () => {
                    if (!isComposite)
                        triggerChange(getValue());
                });
                return dom;
            },
            type: 'model',
            mount (parent: IMountParent = 'body') {
                mountParentWithTChild(parent, this.exe());
            }
        };
    };
    result.exe = () => result().exe();
    result.mount = (parent: IMountParent = 'body') => {
        mountParentWithTChild(parent, result().exe());
    },
    result.type = 'model';
    return result;
};