/*
 * @Author: tackchen
 * @Date: 2022-10-18 09:52:03
 * @Description: Coding something
 */

import {IJson} from '../common';
import {IBuilderParameter} from '../core';
import {IReactBuilder, TReactionItem} from '../reactive/react';

// const StyleAtoms = {
//     css: '',
//     borderBox () {
//         return '';
//     }
// };

type TUnit = 'px' | '%' | 'rm' | 'vh' | 'vw' | 'em' | 'rem' | 'in' | 'cm' | 'mm' | 'ex' | 'pt' | 'pc';

type TI = 'i';

type TCssValue = number | string;

type TCssCommonValue = 'inherit' | 'initial' | 'unset' | 'revert';

type TNumberStyle = (v: TCssValue | TCssValue[], unit?: TUnit | TI, i?: TI) => IStyle;
type TNoneArgStyle = (i?: TI) => IStyle;
type TStringStyle<T = string> = (v: T, i?: TI) => IStyle;
interface TColorStyle {
    (r: number, g: number, b: number, a?: number, i?: TI): IStyle;
    (v: string, i?: TI): IStyle;
}
interface TFourValueStyle {
    (v: TCssValue, unit?: TUnit, i?: TI): IStyle;
    (top: TCssValue, right: TCssValue, unit?: TUnit, i?: TI): IStyle;
    (top: TCssValue, right: TCssValue, bottom: TCssValue, left: TCssValue, unit?: TUnit, i?: TI): IStyle;
}

export interface IStyleAtom {
    borderBox: TNoneArgStyle;
    // number style
    paddingTop: TNumberStyle;
    fontSize: TNumberStyle;
    padding: TFourValueStyle;

    margin: TFourValueStyle;
    marginBottom: TNumberStyle;
    marginLeft: TNumberStyle;

    width: TNumberStyle;
    maxWidth: TNumberStyle;
    position: TStringStyle<'relative' | 'absolute' | 'fixed' | 'sticky' | 'static' | TCssCommonValue>;

    borderBottom: TNumberStyle;
    border: TStringStyle;
    color: TColorStyle;
    i(): IStyle;
}
export interface IStyleBuilder extends IBuilderParameter{
    exe(parent: HTMLElement): string;
    type: 'style';
}

export interface IStyle extends IStyleAtom{
    (json: IJson<string | number | IReactBuilder>): IStyleBuilder;
    (ts: TemplateStringsArray, ...reactions: TReactionItem[]): IStyleBuilder;
    (style: string): IStyleBuilder;
}

type ICssCBArg = string | IStyle | IStyleBuilder | ICssCBArg[];

export interface ICssCallback {
    (...args: ICssCBArg[]): string;
}

export interface ICss {
    (selector: string): ICssCallback;
}

export const style: IStyle = (() => {}) as any;
export const css: ICss = (selector: string) => {
    return (...args: ICssCBArg[]) => {
        const str = '';

        let currentStyle = '';

        for (const item of args) {
            if (typeof item === 'string') {
                currentStyle += item + ';';
            }
        }
        return '';
    };
};