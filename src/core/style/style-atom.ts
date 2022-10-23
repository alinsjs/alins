/*
 * @Author: tackchen
 * @Date: 2022-10-22 21:03:39
 * @Description: Coding something
 */


import {IStyleBuilder, TStyleReaction} from './style';


type TUnit = 'px' | '%' | 'rm' | 'vh' | 'vw' | 'em' | 'rem' | 'in' | 'cm' | 'mm' | 'ex' | 'pt' | 'pc';

type TI = 'i';
type TStyleValue = number | string | TStyleReaction;

type TCssCommonValue = 'inherit' | 'initial' | 'unset' | 'revert';

type TNumberStyle = (v: TStyleValue | TStyleValue[], unit?: TUnit | TI, i?: TI) => IStyleBuilder;
type TNoneArgStyle = (i?: TI) => IStyleBuilder;
type TStringStyle<T = string> = (v: T, i?: TI) => IStyleBuilder;
interface TColorStyle {
    (r: number, g: number, b: number, a?: number, i?: TI): IStyleBuilder;
    (v: string, i?: TI): IStyleBuilder;
}
interface TFourValueStyle {
    (v: TStyleValue, unit?: TUnit, i?: TI): IStyleBuilder;
    (top: TStyleValue, right: TStyleValue, unit?: TUnit, i?: TI): IStyleBuilder;
    (top: TStyleValue, right: TStyleValue, bottom: TStyleValue, left: TStyleValue, unit?: TUnit, i?: TI): IStyleBuilder;
}

export const DefaultUint = 'px';

export interface IStyleAtoms {
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
    position: TStringStyle<
        'relative' | 'absolute' | 'fixed' |
        'sticky' | 'static' | TCssCommonValue
    >;

    borderBottom: TNumberStyle;
    border: TStringStyle;
    color: TColorStyle;
    i(): IStyleAtoms;
}

export const StyleAtoms: IStyleAtoms = {
    borderBox (this: IStyleBuilder, ) {
        return this;
    }
} as any;