/*
 * @Author: tackchen
 * @Date: 2022-10-23 19:19:06
 * @Description: Coding something
 */

import {IBuilderParameter, IJson} from './common.d';
import {TReactionItem, IReactBuilder} from './react.d';

export interface IStyleBuilder extends IBuilderParameter{
  exe(parent: HTMLElement): void;
  // generateBindings(onchange: (onctent: string)=>void): string;
  generate(start?: number): {scopeTemplate: string, scopeReactions: TReactionItem[]};
  type: 'style';

}

export type TUnit = 'px' | '%' | 'rm' | 'vh' | 'vw' | 'em' | 'rem' | 'in' | 'cm' | 'mm' | 'ex' | 'pt' | 'pc';

export type TI = 'i';

export type TStyleReaction = IReactBuilder | TReactionItem<number | string>;

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