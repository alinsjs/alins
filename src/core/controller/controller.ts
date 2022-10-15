/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:34
 * @Description: Coding something
 */

import {forController, IForController} from './for';

export interface IController {
    
}
export interface IControllerBuilder {
    for: IForController;
}

export const controllers = {
    for: forController
};

export const $for = forController;
export const $if = (() => 1) as any;
export const $switch = (() => 1) as any;
export const $while = (() => 1) as any;

export const $case = (() => 1) as any;