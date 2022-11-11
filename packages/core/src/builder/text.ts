/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-03 08:36:37
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-11 08:09:34
 */
import {exeReactionValue} from 'alins-reactive';
import {IBuilderParameter, TReactionValue} from 'alins-utils';

export type TTextArg = TReactionValue<number|string>

export interface ITextBuilder extends IBuilderParameter {
  exe(parent: Element, isInput: boolean): void;
  type: 'text',
}

export function text (content: TTextArg): ITextBuilder {
    return {
        exe (parent: Element, isInput: boolean) {
            if (isInput) {
                (parent as HTMLInputElement).value = exeReactionValue(content, (v) => {
                    (parent as HTMLInputElement).value = v + '';
                }) + '';
            } else {
                const node = document.createTextNode(exeReactionValue(content, (v) => {
                    node.textContent = v + '';
                }) + '');
                parent.appendChild(node);
            }
        },
        type: 'text',
    };
}