/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:34
 * @Description: Coding something
 */

import {forController, IForController} from './for';
import {ifController, IIfController} from './if';

export interface IController {
    
}
export interface IControllerBuilder {
    for: IForController;
    if: IIfController;
}

export const controllers = {
    for: forController,
    if: ifController,
};

export const $for = forController;
export const $if = (() => 1) as any;
export const $switch = (() => 1) as any;
export const $while = (() => 1) as any;

export const $case = (() => 1) as any;