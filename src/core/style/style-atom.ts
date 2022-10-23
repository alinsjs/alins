/*
 * @Author: tackchen
 * @Date: 2022-10-22 21:03:39
 * @Description: Coding something
 */


import {IJson} from '../common';
import {IBuilderParameter} from '../core';
import {countBindingValue, IReactBuilder, IReactItem} from '../reactive/react';
import {OnlyNumberAttrs, style, TStyleReaction} from './style';


type TUnit = 'px' | '%' | 'rm' | 'vh' | 'vw' | 'em' | 'rem' | 'in' | 'cm' | 'mm' | 'ex' | 'pt' | 'pc';

type TI = 'i';
const IMP = 'i';

type TStyleValue = number | string | TStyleReaction;

type TCssCommonValue = 'inherit' | 'initial' | 'unset' | 'revert';

type TNumberStyle = (v: TStyleValue, unit?: TUnit | TI, i?: TI) => IStyleAtoms;

type TNoneArgStyle = (i?: TI) => IStyleAtoms;
type TStringStyle<T = string> = (v: T, i?: TI) => IStyleAtoms;
interface TColorStyle {
    (r: number, g: number, b: number, a?: number, i?: TI): IStyleAtoms;
    (v: string, i?: TI): IStyleAtoms;
}
interface TFourValueStyle {
    (v: TStyleValue, unit?: TUnit, i?: TI): IStyleAtoms;
    (top: TStyleValue, right: TStyleValue, unit?: TUnit, i?: TI): IStyleAtoms;
    (top: TStyleValue, right: TStyleValue, bottom: TStyleValue, left: TStyleValue, unit?: TUnit, i?: TI): IStyleAtoms;
}

export const DefaultUint = 'px';

export interface IStyleAtoms extends IBuilderParameter{
    result: IJson<string | (()=>string)>;
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
    exe(parent: HTMLElement): string;
    type: 'style';
}

export const StyleAtoms: IStyleAtoms = {
    borderBottom (v: TStyleValue, unit?: TUnit, i?: TI) {
        return createAtomChild({}).borderBottom(v, unit, i);
    },
    width (v: TStyleValue, unit?: TUnit | TI, i?: TI) {
        return createAtomChild({}).width(v, unit, i);
    },
} as any as IStyleAtoms;

export function createAtomChild (
    result: IJson<string | (()=>string)> = {}
): IStyleAtoms {
    (window as any).xx = result;
    return {
        result,
        borderBottom (v: TStyleValue, unit?: TUnit | TI, i?: TI) {
            result.borderBottom = transformAtomStyleValue('borderBottom', v, unit, i);
            console.log(result);
            return this;
        },
        width (v: TStyleValue, unit?: TUnit | TI, i?: TI) {
            result.width = transformAtomStyleValue('width', v, unit, i);
            console.log(result);
            return this;
        },
        exe (dom: HTMLElement) {
            return style(this.result).exe(dom);
        },
        type: 'style',
    } as any;
};

function transformAtomStyleValue (
    key: string,  v: TStyleValue, unit?: TUnit|TI|'', i?: TI
): string | (()=>string) {

    if (unit === IMP) {
        i = IMP;
        unit = '';
    }
    const tail = `${unit || ''}${createCssITail(i)}`;

    const iu = !!unit || OnlyNumberAttrs.includes(key); // ignoreUnit

    if (typeof v === 'number' || typeof v === 'string') {
        return concatValue(iu, v, tail);
    } else if ((v as IReactBuilder).type === 'react' ) {
        return () => concatValue(iu, countBindingValue((v as IReactBuilder).exe({type: 'style'})), tail);
    } else if (typeof v === 'function') {
        return () => concatValue(iu, v(), tail);
    } else {
        return () => concatValue(iu, (v as IReactItem).value, tail);
    }
}

function concatValue (iu: boolean, v: string | number, tail: string) {
    if (iu || typeof v === 'string') return v + tail;
    return (typeof v === 'number' ? `${v}${DefaultUint}${tail}` : v + tail);
}

function createCssITail (i?: TI) {
    return i === IMP ? '!important' : '';
}