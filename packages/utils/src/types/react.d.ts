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

/*
  ! 针对一个可能是ts的很奇怪的bug
  const list = $([{content: '1', done: false}]);
  done 会被 推断了 IReactItem<true> | IReactItem<false>
  而不是 IReactItem<boolean> 从而对其赋值时会导致出现ts报错
  ! 不能将类型“boolean”分配给类型“IReactItem<false> | IReactItem<true>”。
*/
type TParseBoolean<T> = T extends object|string|undefined|symbol|number|Function ? T: boolean;

type IReactJson<T> = T extends Array<infer K> ? (
  Array<IReactWrap<K>>
): ({
  [prop in (keyof T)]: IReactWrap<T[prop]>;
} & IJson) // ! & IJson 为了绑定的时候不报类型错误


export type IReactWrap<T> = T extends object ? (IReactJson<T> & IReactObject<T>) : IReactItem<TParseBoolean<T>>;

export type TOnChangeFunc = (content: string, oldContent: string) => void;

export interface IReactBindingTemplate<T=any> {
  template: string[], // TemplateStringsArray
  reactions: (TReactionItem<T>)[], // | any[], // ? 为了绑定的时候不报类型错误
}
export interface IReactBindingTemplateFactory<T=any> {
  add(d: IReactBindingTemplate<T>): void;
  get(): IReactBindingTemplate<T>;
  reactive(
    onchange: TOnChangeFunc,
    needOldContent?: boolean,
  ): void;
  computed(): IComputedItem<T>;
}

export type TReactContextType = 'dom-info' | 'style' | 'computed' | 'css';
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