/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:13:50
 * @Description: Coding something
 */

import {IChildren} from '../dom-util';
import {IWatchRefTarget} from 'packages/reactive/src/watch';
import {computed, react} from 'packages/reactive/src';


export type IIfTarget = IWatchRefTarget<boolean>;
export type IIfCall = ()=>IChildren|void;

export interface IIfReturn {
    elif(data: IIfTarget, call: IIfCall): IIfReturn;
    else(call: ()=>IChildren): IChildren;
    end(): void;
}
  
export interface IComponentContext {
    if: IIfReturn['elif'];
    for: ()=>void;
    switch: ()=>void;
    dom: ()=>void;
    update: ()=>void;
    $: typeof react;
    co: typeof computed;
}
