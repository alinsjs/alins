/*
 * @Author: tackchen
 * @Date: 2022-10-23 19:19:06
 * @Description: Coding something
 */

import {IBuilderParameter, IJson} from './common.d';
import {IReactBuilder, TComputedFunc, TReactionItem, TReactionValue} from './react.d';

export type IStyleComponent = string | IStyleBuilder | IStyleAtoms | IReactBuilder;

export type IStyleComponentArray = IStyleComponent | IStyleComponentArray[];

export interface IStyleBuilder extends IBuilderParameter{
  exe(parent: HTMLElement): void;
  mount(parent: HTMLElement | string): void;
  // generateBindings(onchange: (onctent: string)=>void): string;
  generate(start: number): {scopeTemplate: string, scopeReactions: TReactionItem[]};
  react(): TComputedFunc<string>;
  type: 'style';
}

export type TUnit = 'px' | '%' | 'rm' | 'vh' | 'vw' | 'em' | 'rem' | 'in' | 'cm' | 'mm' | 'ex' | 'pt' | 'pc';

export type TI = 'i';

export type TStyleValue<T = number | string> = TReactionValue<T>;

type TCssCommonValue = 'inherit' | 'initial' | 'unset' | 'revert' | 'none' | 'auto';

type TNumberStyle = (v: TStyleValue, unit?: TUnit | TI, i?: TI) => IStyleAtoms;
type TNumberAutoStyle = (v: TStyleValue|'auto', unit?: TUnit | TI, i?: TI) => IStyleAtoms;
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
export type TPosition = 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static' | TCssCommonValue;

export interface INoneArgsAtoms {
  // none arg style
  borderBox: TNoneArgStyle;
  relative: TNoneArgStyle;
  absolute: TNoneArgStyle;
  fixed: TNoneArgStyle;
}

export interface IComposeStyle {
  cursorUrl: (...args: TReactionValue<string|number>[]) => IStyleAtoms;
}

export type TStyleJsonValue = {[key in keyof IStyleArgsAtomsBase]?: TReactionValue<string|number>} & IJson<TReactionValue<string|number>>

export interface IAtomsTool {
  join: (...styles: (IStyleComponent|TStyleJsonValue)[]) => IStyleAtoms;
}

export interface IStyleArgsAtomsBase {
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
  top: TNumberStyle;
  left: TNumberStyle;
  bottom: TNumberStyle;
  right: TNumberStyle;
  borderRadius: TNumberStyle;
  textIndent: TNumberStyle;

  width: TNumberAutoStyle;
  maxWidth: TNumberAutoStyle;
  height: TNumberAutoStyle;
  maxHeight: TNumberAutoStyle;
  flexBasis: TNumberAutoStyle;

  // pure number style
  opacity: TPureNumberStyle;
  zIndex: TPureNumberStyle;
  flex: TPureNumberStyle;
  flexGrow: TPureNumberStyle;
  flexShrink: TPureNumberStyle;

  // fournumber style
  margin: TFourValueStyle;
  padding: TFourValueStyle;

  // optional string style
  textDecoration: TStringStyle<TTextDeco>;
  position: TStringStyle<TPosition>;
  alignItems: TStringStyle<'stretch'|'center'|'flex-start'|'flex-end'|'baseline'|TCssCommonValue>;
  justifyContent: TStringStyle<'flex-start'|'flex-end'|'center'|'space-between'|'space-evenly'|'space-around'|TCssCommonValue>;
  display: TStringStyle<'none'|'flex'|'block'|'inline'|'inline-block'|'list-item'|'run-in'|'compact'|'marker'|'table'|'inline-table'|'table-row-group'|'table-header-group'|'table-footer-group'|'table-row'|'table-column-group'|'table-column'|'table-cell'|'table-caption'|TCssCommonValue>;
  alignContent: TStringStyle<'stretch'|'center'|'flex-start'|'flex-end'|'space-between'|'space-around'|TCssCommonValue>;
  backgroundAttachment: TStringStyle<'scroll'|'fixed'|'local'|TCssCommonValue>;
  backgroundBlendMode: TStringStyle<'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'saturation'|'color'|'luminosity'|TCssCommonValue>;
  backgroundClip: TStringStyle<'border-box'|'padding-box'|'content-box'|TCssCommonValue>;
  backgroundOrigin: TStringStyle<'border-box'|'padding-box'|'content-box'|TCssCommonValue>;
  backgroundRepeat: TStringStyle<'repea'|'repeat-x'|'repeat-y'|'no-repeat'|TCssCommonValue>;
  boxSizing: TStringStyle<'content-box'|'border-box'|'inherit'>;
  clear: TStringStyle<'left'|'right'|'both'|'none'|'inherit'>;
  textAlign: TStringStyle<'auto'|'left'|'right'|'center'|'justify'|'start'|'end'|TCssCommonValue>;
  wordWrap: TStringStyle<'normal'|'break-word'>;
  whiteSpace: TStringStyle<'normal'|'pre'|'nowrap'|'pre-wrap'|'pre-line'|'inherit'>;
  wordBreak: TStringStyle<'normal'|'break-all'|'keep-all'>;
  wordSpacing: TStringStyle<'normal'|'length'|'inherit'>;
  verticalAlign: TStringStyle<'baseline'|'sub'|'super'|'top'|'text-top'|'middle'|'bottom'|'text-bottom'|'length'|'%'|'inherit'>;
  fontStyle: TStringStyle<'normal'|'italic'|'oblique'|'inherit'>;
  flexDirection: TStringStyle<'row'|'row-reverse'|'column'|'column-reverse'|'initial'|'inherit'>;
  flexWrap: TStringStyle<'nowrap'|'wrap'|'wrap-reverse'|'initial'|'inherit'>;
  resize: TStringStyle<'none'|'both'|'horizontal'|'vertical'>;
  textOverflow: TStringStyle<'clip'|'ellipsis'|'string'|'initial'|'inherit'>;
  float: TStringStyle<'left'|'right'|'none'|'inherit'>;
  visibility: TStringStyle<'visible'|'hidden'|'collapse'|'inherit'>;
  overflow: TStringStyle<'visible'|'hidden'|'scroll'|'auto'|'inherit'>;
  overflowX: TStringStyle<'visible'|'hidden'|'scroll'|'auto'|'inherit'>;
  overflowY: TStringStyle<'visible'|'hidden'|'scroll'|'auto'|'inherit'>;
  cursor: TStringStyle<'auto'|'crosshair'|'pointer'|'move'|'e-resize'|'ne-resize'|'nw-resize'|'n-resize'|'se-resize'|'sw-resize'|'s-resize'|'w-resize'|'text'|'wait'|'help'>;
  
  // ([a-z\-]+)\|
  // *([a-z\-]+)	.*\n

  // common string style
  border: TStringStyle;
  borderBottom: TStringStyle;
  borderTop: TStringStyle;
  borderLeft: TStringStyle;
  borderRight: TStringStyle;
  boxShadow: TStringStyle;
  fontFamily: TStringStyle;
  fontWeight: TStringStyle;
  animation: TStringStyle;
  backgroundImage: TStringStyle;
  backgroundSize: TStringStyle;
  backgroundPosition: TStringStyle;
  backdropFilter: TStringStyle;
  filter: TStringStyle;
  transform: TStringStyle;
  transition: TStringStyle;
  outline: TStringStyle;
  clip: TStringStyle;
  flexFlow: TStringStyle;
  textShadow: TStringStyle;
  content: TStringStyle;

  // color
  color: TColorStyle;
  backgroundColor: TColorStyle;
  borderColor: TColorStyle;
}

export interface IStyleArgsAtoms extends IStyleArgsAtomsBase, IAtomsTool {}

export interface IStyleAtoms extends IStyleArgsAtoms, INoneArgsAtoms, IComposeStyle, IStyleBuilder{
  _result: IJson<string | (()=>string)>;
  _styles: IStyleComponent[];
}
export interface IPseudoBuilder extends IBuilderParameter {
  type: 'pseudo',
  exe (dom: HTMLElement): void;
}