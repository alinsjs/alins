/*
 * @Author: tackchen
 * @Date: 2022-10-23 19:19:06
 * @Description: Coding something
 */

import {IBuilderParameter, IJson} from './common.d';
import {TReactionItem, TReactionValue} from './react.d';

export interface IStyleBuilder extends IBuilderParameter{
  exe(parent: HTMLElement): void;
  mount(parent: HTMLElement | string): void;
  // generateBindings(onchange: (onctent: string)=>void): string;
  generate(start?: number): {scopeTemplate: string, scopeReactions: TReactionItem[]};
  type: 'style';

}

export type TUnit = 'px' | '%' | 'rm' | 'vh' | 'vw' | 'em' | 'rem' | 'in' | 'cm' | 'mm' | 'ex' | 'pt' | 'pc';

export type TI = 'i';

type TStyleValue<T = number | string> = TReactionValue<T>;

type TCssCommonValue = 'inherit' | 'initial' | 'unset' | 'revert' | 'none' | 'auto';

type TNumberStyle = (v: TStyleValue, unit?: TUnit | TI, i?: TI) => IStyleAtoms;
type TPureNumberStyle = (v: TStyleValue<number>, unit?: TUnit | TI, i?: TI) => IStyleAtoms;

type TNoneArgStyle = (i?: TI) => IStyleAtoms;
type TStringStyle<T = string> = (v: T | TStyleValue<T>, i?: TI) => IStyleAtoms;
interface TColorStyle {
    (r: TReactionValue<number>, g:  TReactionValue<number>, b:  TReactionValue<number>, a?:  TReactionValue<number>, i?: TI): IStyleAtoms;
    (v:  TReactionValue<string>, i?: TI): IStyleAtoms;
}
interface TFourValueStyle {
    (v: TStyleValue, unit?: TUnit, i?: TI): IStyleAtoms;
    (top: TStyleValue, right: TStyleValue, unit?: TUnit, i?: TI): IStyleAtoms;
    (top: TStyleValue, right: TStyleValue, bottom: TStyleValue, left: TStyleValue, unit?: TUnit, i?: TI): IStyleAtoms;
}

export type TTextDeco = 'blink'|'dashed'|'dotted'|'double'|'line-through'|'overline'|'solid'|'underline'|'wavy'|TCssCommonValue;
export type TPosition = 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static' | TCssCommonValue

export interface INoneArgsAtoms {
  // none arg style
  borderBox: TNoneArgStyle;
  relative: TNoneArgStyle;
}

export interface IStyleArgsAtoms {
  // ([a-zA-Z]*?)(: [a-zA-Z<>]*?;\n) => '$1', 正则
  // number style
  paddingTop: TNumberStyle;
  paddingBottom: TNumberStyle;
  paddingLeft: TNumberStyle;
  paddingRight: TNumberStyle;
  marginTop: TNumberStyle;
  marginBottom: TNumberStyle;
  marginLeft: TNumberStyle;
  marginRight: TNumberStyle;
  fontSize: TNumberStyle;
  lineHeight: TNumberStyle;
  width: TNumberStyle;
  maxWidth: TNumberStyle;
  height: TNumberStyle;
  maxHeight: TNumberStyle;
  top: TNumberStyle;
  left: TNumberStyle;

  // pure number style
  opacity: TPureNumberStyle;
  zIndex: TPureNumberStyle;
  flex: TPureNumberStyle;

  // fournumber style
  margin: TFourValueStyle;
  padding: TFourValueStyle;

  // optional string style
  textDecoration: TStringStyle<TTextDeco>;
  position: TStringStyle<TPosition>;

  // common string style
  border: TStringStyle;
  borderBottom: TStringStyle;
  fontWeight: TStringStyle;

  // color
  color: TColorStyle;
  backgroundColor: TColorStyle;
}

export interface IStyleAtoms extends IStyleArgsAtoms, INoneArgsAtoms, IStyleBuilder{
  result: IJson<string | (()=>string)>;
}
export interface IPseudoBuilder extends IBuilderParameter {
  type: 'pseudo',
  exe (dom: HTMLElement): void;
}