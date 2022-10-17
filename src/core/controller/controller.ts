/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:34
 * @Description: Coding something
 */

import {bindController, IBindController} from './bind';
import {forController, IForController} from './for';
import {ifController, IIfController} from './if';
import {IShowController, showController} from './show';
import {ISwitchController, switchController} from './switch';

export interface IController {
    
}
export interface IControllerBuilder {
    for: IForController;
    if: IIfController;
    show: IShowController;
    bind: IBindController;
    switch: ISwitchController;
}

export const controllers = {
    for: forController,
    if: ifController,
    show: showController,
    bind: bindController,
    switch: switchController,
};

export const $for = forController;
export const $if = (() => 1) as any;
export const $switch = (() => 1) as any;
export const $while = (() => 1) as any;

export const $case = (() => 1) as any;