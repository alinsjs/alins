/*
 * @Author: tackchen
 * @Date: 2022-10-22 21:03:39
 * @Description: Coding something
 */


import {
    countBindingValue,
} from 'alins-reactive';
import {IReactBuilder, IReactItem, IJson, IStyleAtoms, IStyleArgsAtoms, TStyleValue, TUnit, TI, IStyleComponent, IAtomsTool, IStyleBuilder, TStyleJsonValue} from 'alins-utils';
import {parseSingleCssItem} from '../css';
import {OnlyNumberAttrs, style} from '../style';
import {createComposeValue} from './style-compose';
import {createFixedValue} from './style-fixed';

const IMP = 'i';

export const DefaultUint = 'px';

type TAtomFunc = (...args: any[]) => IStyleAtoms;

export const StyleAtoms = (() => {

    const StyleNames: (keyof IStyleArgsAtoms)[] = [
        // none arg style
        'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'fontSize', 'lineHeight', 'top', 'left', 'bottom', 'right', 'borderRadius', 'textIndent',
        // TNumberAutoStyle
        'width', 'maxWidth', 'minWidth', 'height', 'maxHeight', 'minHeight', 'flexBasis',
        // pure number style
        'opacity', 'zIndex', 'flex', 'flexGrow', 'flexShrink',        // fournumber style
        'margin', 'padding',
        // optional string style
        'textDecoration', 'position', 'alignItems', 'justifyContent', 'display', 'alignContent', 'backgroundAttachment', 'backgroundBlendMode', 'backgroundClip', 'backgroundOrigin', 'backgroundRepeat', 'boxSizing', 'clear', 'textAlign', 'wordWrap', 'whiteSpace', 'wordBreak', 'wordSpacing', 'verticalAlign', 'fontStyle', 'flexDirection', 'flexWrap', 'resize', 'textOverflow', 'float', 'visibility', 'overflow', 'overflowX', 'overflowY', 'cursor',
        // common string style
        'border', 'borderBottom', 'borderTop', 'borderLeft', 'borderRight', 'boxShadow', 'fontFamily', 'fontWeight', 'animation', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backdropFilter', 'filter', 'transform', 'transition', 'outline', 'clip', 'flexFlow', 'textShadow', 'content',        // color
        'color', 'backgroundColor', 'borderColor',
    ];

    const AtomsBase: IJson<any> = {
        generate (start = 0) {
            const data = style(this._result).generate(start);
            if (this._styles.length === 0) {
                return data;
            }
            (this._styles as IStyleComponent[]).forEach(item => {
                data.scopeTemplate += parseSingleCssItem(
                    item,
                    data.scopeReactions,
                );
            });
            return data;
        },
        exe (dom: HTMLElement) {
            if (this._styles.length > 0) {
                (this._styles as IStyleComponent[]).forEach(item => {
                    if (typeof item === 'string' || (item).type === 'react') {
                        style(item as any).exe(dom);
                    } else if (item.type === 'style') {
                        (item as IStyleBuilder).exe(dom);
                    } else if (typeof item === 'object') {
                        style(item as TStyleJsonValue).exe(dom);
                    }
                });
            }
            return style(this._result).exe(dom);
        },
        join (...styles: IStyleComponent[]) {
            this._styles.push(...styles);
            return this;
        },
        type: 'style',
    };
    const Atoms: IJson<TAtomFunc> & IAtomsTool = {
        join (...styles: IStyleComponent[]) {
            return Object.assign({_result: {}, _styles: [...styles]}, AtomsBase) as any;
        }
    };
    const setAtomValue = (name: string) => {
        Atoms[name] = (...args) => {
            // ! 第一个链式调用 会生成一个空的 result
            // 后续的链式调用都是往这个 result 上加
            // 到最后mount的时候 挂这个result
            return Object.assign({_result: {}, _styles: []}, AtomsBase)[name](...args);
        };
    };

    StyleNames.forEach(name => {
        AtomsBase[name] = function (this: IStyleAtoms, ...args: any[]) {
            this._result[name] = transformAtomStyleValue.apply(null, [name, ...args]);
            return this;
        };
        setAtomValue(name);
    });

    const FixedValue = createFixedValue();
    Object.keys(FixedValue).forEach(name => {
        AtomsBase[name] = function (this: IStyleAtoms) {
            Object.assign(this._result, (FixedValue as any)[name]);
            return this;
        };
        setAtomValue(name);
    });

    const ComposeValue = createComposeValue();
    Object.keys(ComposeValue).forEach(name => {
        AtomsBase[name] = function (this: IStyleAtoms, ...args: any[]) {
            Object.assign(this._result, (ComposeValue as any)[name](...args));
            return this;
        };
    });

    return Atoms as any as IStyleAtoms;

})();

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
