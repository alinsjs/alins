/*
 * @Author: tackchen
 * @Date: 2022-10-23 19:26:19
 * @Description: Coding something
 */

import {
    index, forceUpdate, subscribe, reactValue, getListeners,
    value, json, updateFirstLevel
} from './symbol';
import {IBuilderParameter, IJson} from './common';

export interface IReactBase<T = any> {
  [index]?: IReactItem<number>;
  [forceUpdate](): void;
  [subscribe](fn: (v:T, old:T, index: number) => void):  T;
  [reactValue]: boolean;
  [getListeners](): Function[];
}

export interface IReactItem<T = any> extends IReactBase<T>{
  value: T;
  isUndefined(): boolean;
  toJSON: ()=> T | undefined; // ! 重写value的toJSON方法
}

export type TComputedFunc<T = any> = (...args: any[]) => T;


export type TReactionItem<T=any> = IReactItem<T> | TComputedFunc<T> | IComputedItem<T>;

export type TReactionValue<T> = T | IReactBuilder | TReactionItem<T>;

export interface IComputedItem<T = any> extends IReactItem<T> {}


// export type TBaseTypes = number | boolean | string | null | undefined;
// type TReactTypes = TBaseTypes | IJson<TReactTypes> | TReactTypes[];

export interface IReactObject<T = any> extends IReactBase<T> {
  // ! 本来应该使用 T，
  // ! 由于封装了一层，所以赋值时ts类型系统会报错，故使用IJson
  // ! 牺牲了 value和json返回值的类型
  get [value](): IJson;
  get [json](): IJson;
  // get [value](): T;
  // get [json](): T;
  [updateFirstLevel](): void;
}
export type IReactWrap<T> = T extends object ? ({
  [prop in (keyof T)]: IReactWrap<T[prop]>;
} & IReactObject<T>
  & IJson // ! & IJson 为了绑定的时候不报类型错误
): IReactItem<T>;

export interface IReactBindingTemplate {
  template: string[], // TemplateStringsArray
  reactions: TReactionItem[], // | any[], // ? 为了绑定的时候不报类型错误
}

export type TReactContextType = 'dom-info' | 'style' | 'computed';
// react上下文环境
export interface IReactContext {
  type: TReactContextType,
} // todo

export interface IReactBinding extends IReactBindingTemplate {
  context: IReactContext; // todo
}
export interface IReactBuilder extends IBuilderParameter {
  type: 'react';
  exe(context: IReactContext): IReactBinding;
  modTemplate(mod: (v: string) => string, i?: number): void;
  isEmpty(): boolean;
  templateValue(): string;
}