/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-03 08:36:37
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-03 08:49:35
 */
import {exeReactionValue} from 'alins-reactive';
import {IBuilderParameter, TReactionValue} from 'alins-utils';

export type THTMLArg = TReactionValue<number|string>

export interface IHTMLBuilder extends IBuilderParameter {
  exe(onchange: (v: string) => void): string|number;
  type: 'html',
}

export function html (content: THTMLArg): IHTMLBuilder {

    return {
        exe (onchange: (v: string) => void) {
            return exeReactionValue(content, (v) => {onchange(v + '');}) + '';
        },
        type: 'html',
    };
}