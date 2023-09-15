/*
 * @Author: tackchen
 * @Date: 2022-10-23 19:26:19
 * @Description: Coding something
 */

import { IJson } from './common';
import { AlinsType } from './enum';
import { type, util } from './symbol';

export type ISimpleValue = string|number|boolean;

export type IOnChange<T = string> = (nv: T, ov: T, path: string, prop: string, remove?: boolean) => void;

// Reactive
export interface IProxyUtils {
  path: string[];
  lns: IProxyListenerMap;
  commonLns?: Set<IOnChange>;
  triggerChange: (property: string, nv: any, old?: any, remove?: boolean, isNew?: boolean) => void;
  forceWrite: (v: any, k?: string) => void;
  subscribe: (ln: IProxyListener<any>, deep?: boolean) => void;
  isArray: boolean;
  shallow: boolean;
  forceUpdate: ()=>void;
  // clearCache: ()=>void;
  proxy: IProxyData<any>;
  scopeItems?: any[];
  replaceLns?: boolean;
  extraLns?: Set<IProxyListenerMap>;
  data: any;
}

export interface IProxyBase<T extends AlinsType.Proxy|AlinsType.Ref> {
  // @ts-ignore
  [util]: IProxyUtils;
  // @ts-ignore
  [type]: T;
}

export interface IRefData<T=any> extends IProxyBase<AlinsType.Ref> {
  v: T;
}


export type IProxyData<
    T,
    K = T extends object ? (T & IProxyBase<AlinsType.Proxy>) : IRefData<T>
> = K;

export type IProxyListener<T = any> = IOnChange<T>;
export type IProxyListenerMap = IJson<Set<IOnChange>>;
