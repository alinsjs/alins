/*
 * @Author: chenzhongsheng
 * @Date: 2023-10-16 10:22:39
 * @Description: 宏处理

let $ref: <T>(v: T) => T;
let $set: <T = any>(v: T) => void;
let $shallow: <T>(v: T) => T;
let $static: <T>(v: T) => T;
let $mount: (v: HTMLElement|DocumentFragment, app: HTMLElement|Node|string)=>void;
let $watch: <T=any>(v: any, fn: IProxyListener<T>) => void;

let $state: <T extends Record<string, any>>(data: T)=>T;
let $store: ()=>void;

type ILifecycleMacro<Return = void> = <T extends HTMLElement = HTMLElement>(v: T) => Return;
let $created: ILifecycleMacro;
let $appended: ILifecycleMacro;
let $mounted: ILifecycleMacro<void|ILifecycleMacro>;
let $removed: ILifecycleMacro;
 */
