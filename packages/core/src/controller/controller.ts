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
import {TBuilderArg} from '../builder/builder';
import {IComponentBuilder, TCompBuilderArg} from '../comp/comp';
import {IElementBuilder, mountSingleChild, transformBuilderToDom} from '../element/transform';

export type TControllerBuilder = IElementBuilder | IComponentBuilder;

export type TControllerType = 'comp' | 'builder';

export type TControllerArg<K extends TControllerType> = K extends 'builder' ? TBuilderArg[] : TCompBuilderArg[];

export interface IControllers<K extends TControllerType = 'builder'> {
    for: IForController<K>;
    if: IIfController<K>;
    show: IShowController;
    model: IModelController;
    switch: ISwitchController;
}

export const controllers: IControllers = {
    for: forController,
    if: ifController,
    show: showController,
    model: modelController,
    switch: switchController,
};

export function getControllerDoms (builder: TControllerBuilder): {
    dom: HTMLElement | DocumentFragment,
    children: HTMLElement | HTMLElement[]
} {
    const isComp = builder.type === 'comp';
    const dom = isComp ? mountSingleChild(builder.exe()) : transformBuilderToDom(builder);

    return {
        dom,
        children: isComp ? [].slice.call(dom.children) : dom
    };
}

export function removeControllerDoms (children: HTMLElement | HTMLElement[]) {
    if (children instanceof Array) {
        children.forEach(i => {i.remove();});
    } else {
        children.remove();
    }
}

export function replaceControllerDoms (
    oldDoms: HTMLElement | HTMLElement[],
    newDoms: HTMLElement | HTMLElement[],
) {
    const target = (oldDoms instanceof Array) ? oldDoms[0] : oldDoms;
    const parent = target.parentElement;
    if (!parent) throw new Error('parent not found');
    
    if (newDoms instanceof Array) {
        newDoms.forEach(d => {parent.insertBefore(d, target);});
    } else {
        parent.insertBefore(newDoms, target);
    }
    (oldDoms instanceof Array) ? oldDoms.forEach(n => {n.remove();}) : oldDoms.remove();
}