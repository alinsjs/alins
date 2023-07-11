/*
 * @Author: tackchen
 * @Date: 2022-10-23 19:26:19
 * @Description: Coding something
 */

import {IJson} from './common';
import {AlinsType} from './enum';
import {type, util} from './symbol';

export type ISimpleValue = string|number|boolean;

export type IOnChange<T = string> = (nv: T, ov: T, path: string, prop: string, remove?: boolean) => void;

// Reactive
export interface IProxyUtils {
  path: string[];
  lns: IProxyListenerMap;
  commonLns?: Set<IOnChange>;
  triggerChange: (property: string, nv: any, old?: any, remove?: boolean, isNew?: boolean) => void;
  forceWrite: (v: any) => void;
  subscribe: (ln: IProxyListener<any>, deep?: boolean) => void;
  isArray: boolean;
  shallow: boolean;
  forceUpdate: ()=>void;
  replace(v: any): void;
  proxy: IProxyData<any>;
  scopeItems?: any[];
  replaceLns?: boolean;
  extraLns?: Set<IProxyListenerMap>;
}

interface IProxyBase<T extends AlinsType.Proxy|AlinsType.Ref> {
  [util]: IProxyUtils;
  [type]: T;
}

export interface IRefData<T=any> extends IProxyBase<AlinsType.Ref> {
  value: T;
}


export type IProxyData<
    T,
    K = T extends object ? (T & IProxyBase<AlinsType.Proxy>) : IRefData<T>
> = K;

export type IProxyListener<T = any> = IOnChange<T>;
export type IProxyListenerMap = IJson<Set<IOnChange>>;


// export type IBindReaction =

// import {
//     index, forceUpdate, subscribe, reactValue, getListeners,
//     value, json, replaceValue
// } from './symbol';
// import {IBuilderParameter, IJson} from './common';

// // export type TSimpleValue = number|string|boolean|null|undefined;

// export interface IReactBase<T = any> {
//   [index]?: IReactItem<number>;
//   [forceUpdate](old?: any, index?: number): void;
//   [subscribe](fn: (v:T, old:T, index: number) => void):  T;
//   [reactValue]: boolean;
//   [getListeners](): Function[];
//   [json] (): T;
// }

// export interface IReactItem<T = any> extends IReactBase<T>{
//   value: T;
//   isUndefined(): boolean;
//   toJSON: ()=> T | undefined; // ! 重写value的toJSON方法
//   [replaceValue](v: T): void;
//   type: 'reaction'
// }

// export type TComputedFunc<T = any> = (...args: any[]) => T;


// export type TReactionItem<T=any> = IReactItem<T> | TComputedFunc<T> | IComputedItem<T>;

// export type TReactionValue<T> = T | IReactBuilder | TReactionItem<T>;

// export interface IComputedItem<T = any> extends IReactItem<T> {}


// // export type TBaseTypes = number | boolean | string | null | undefined;
// // type TReactTypes = TBaseTypes | IJson<TReactTypes> | TReactTypes[];

// export interface IReactObject<T = any> extends IReactBase<T> {
//   // ! 本来应该使用 T，
//   // ! 由于封装了一层，所以赋值时ts类型系统会报错，故使用IJson
//   // ! 牺牲了 value和json返回值的类型
//   get [value](): IJson;
//   set [value](v: IJson);
// }

// /*
//   ! 针对一个可能是ts的很奇怪的bug
//   const list = $([{content: '1', done: false}]);
//   done 会被 推断了 IReactItem<true> | IReactItem<false>
//   而不是 IReactItem<boolean> 从而对其赋值时会导致出现ts报错
//   ! 不能将类型“boolean”分配给类型“IReactItem<false> | IReactItem<true>”。
// */
// type TParseBoolean<T> = T extends object|string|undefined|symbol|number|Function ? T: boolean;

// export type IReactWrap<T> = T extends object ? (IReactJson<T> & IReactObject<T>) : IReactItem<TParseBoolean<T>>;

// type IReactJson<T> = {
//   [prop in (keyof T)]: IReactWrap<T[prop]>;
// } & IJson; // ! & IJson 为了绑定的时候不报类型错误


// export type TOnChangeFunc = (content: string, oldContent: string) => void;

// export interface IReactBindingTemplate<T=any> {
//   template: string[], // TemplateStringsArray
//   reactions: (TReactionItem<T>)[], // | any[], // ? 为了绑定的时候不报类型错误

//   index?: number;
// }
// export interface IReactBindingTemplateFactory<T=any> {
//   add(d: IReactBindingTemplate<T>): void;
//   get(): IReactBindingTemplate<T>;
//   reactive(
//     onchange: TOnChangeFunc,
//     needOldContent?: boolean,
//   ): void;
//   computed(): IComputedItem<T>;
// }

// export type TReactContextType = 'dom-info' | 'style' | 'computed' | 'css';
// // react上下文环境
// export interface IReactContext {
//   type: TReactContextType,
// } // todo

// export interface IReactBinding extends IReactBindingTemplate {
//   context: IReactContext; // todo
// }
// export interface IReactBuilder extends IBuilderParameter {
//   type: 'react';
//   exe(context: IReactContext): IReactBinding;
//   modTemplate(mod: (v: string) => string, i?: number): void;
//   isEmpty(): boolean;
//   templateValue(): string;
// }

// type Unpacked<T> = T extends (infer R)[] ? R : T;

// declare global {

//     // ! 这些声明是为了 赋值不报错

//     // const a=$({b:{v:1}}); a.b = {v:2}
//     // 但是会牺牲 a.b[value] 或者 a.b[json]() 的返回值类型
//     // for ts declaration
//     interface Array<T> extends IReactObject<T>{
//       _length: IReactItem<number>;
//     }
//     interface String extends IReactItem<string> {}
//     interface Number extends IReactItem<number> {}
//     interface Boolean extends IReactItem<boolean> {}
//     // type IHackReactObject = {
//     //     [prop in any]: any;
//     // }

//     interface Object extends IReactObject<any>{
//     }
// }
