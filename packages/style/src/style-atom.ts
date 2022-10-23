/*
 * @Author: tackchen
 * @Date: 2022-10-22 21:03:39
 * @Description: Coding something
 */


import {
    countBindingValue,
} from 'alins-reactive';
import {IReactBuilder, IReactItem} from 'alins-utils/src/types/react.d';
import {IJson} from 'alins-utils/src/types/common.d';
import {IStyleAtoms, TStyleValue, TUnit, TI, TTextDeco} from 'alins-utils/src/types/style.d';
import {OnlyNumberAttrs, style} from './style';

const IMP = 'i';

export const DefaultUint = 'px';

export const StyleAtoms: IStyleAtoms = {
    borderBottom (v: TStyleValue, unit?: TUnit, i?: TI) {
        return createAtomChild({}).borderBottom(v, unit, i);
    },
    width (v: TStyleValue, unit?: TUnit | TI, i?: TI) {
        return createAtomChild({}).width(v, unit, i);
    },
    textDecoration (v: TTextDeco, i?: TI) {
        return createAtomChild({}).textDecoration(v, i);
    },
    color (v: string, i?: TI) {
        return createAtomChild({}).color(v, i);
    }
} as any as IStyleAtoms;

export function createAtomChild (
    result: IJson<string | (()=>string)> = {}
): IStyleAtoms {
    (window as any).xx = result;
    return {
        result,
        textDecoration (v: TTextDeco, i?: TI) {
            result.textDecoration = transformAtomStyleValue('textDecoration', v, i);
            return this;
        },
        color (v: string, i?: TI) {
            result.color = transformAtomStyleValue('color', v, i);
            return this;
        },
        borderBottom (v: TStyleValue, unit?: TUnit | TI, i?: TI) {
            result.borderBottom = transformAtomStyleValue('borderBottom', v, unit, i);
            // console.log(result);
            return this;
        },
        width (v: TStyleValue, unit?: TUnit | TI, i?: TI) {
            result.width = transformAtomStyleValue('width', v, unit, i);
            // console.log(result);
            return this;
        },
        generate (start = 0) {
            return style(this.result).generate(start);
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