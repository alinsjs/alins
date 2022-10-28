/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:34
 * @Description: Coding something
 */

import {modelController, IModelController} from './model';
import {forController, IForController} from './for';
import {ifController, IIfController} from './if';
import {IShowController, showController} from './show';
import {ISwitchController, switchController} from './switch';

export interface IControllerBuilder<K extends 'comp' | 'builder' = 'builder'> {
    for: IForController<K>;
    if: IIfController;
    show: IShowController;
    model: IModelController;
    switch: ISwitchController;
}

export const controllers = {
    for: forController,
    if: ifController,
    show: showController,
    model: modelController,
    switch: switchController,
};