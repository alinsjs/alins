/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-03 08:36:37
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-03 11:45:05
 */
import {exeReactionValue} from 'alins-reactive';
import {IBuilderParameter, TReactionValue} from 'alins-utils';

export type TTextArg = TReactionValue<number|string>

export interface ITextBuilder extends IBuilderParameter {
  exe(parent: Element, isInput: boolean): void;
  exeTextNode(): Text;
  type: 'text',
}

export function text (content: TTextArg): ITextBuilder {
    return {
        exe (parent: Element|null, isInput: boolean) {
            if (isInput) {
                (parent as HTMLInputElement).value = exeReactionValue(content, (v) => {
                    (parent as HTMLInputElement).value = v + '';
                }) + '';
                return null;
            } else {
                return this.exeTextNode();
            }
        },
        exeTextNode () {
            const node = document.createTextNode(exeReactionValue(content, (v) => {
                node.textContent = v + '';
            }) + '');
            return node;
        },
        type: 'text',
    };
}