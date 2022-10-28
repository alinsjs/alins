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
import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {ICompConstructor, IComponentBuilder, TCompBuilderArg} from '../comp/comp';
import {IElementBuilder, mountSingleChild, transformBuilderToDom} from '../element/transform';

export type IControllerDom = Node | HTMLElement | HTMLElement[]

export type TControllerBuilder = IElementBuilder | IComponentBuilder;

export type IControllerConstructor = IBuilderConstructor | ICompConstructor;

export type TControllerType = 'comp' | 'builder';

export type TControllerArg<K extends TControllerType> = K extends 'builder' ? TBuilderArg[] : TCompBuilderArg[];

export interface ICompControllers<K extends TControllerType = 'comp'> {
    for: IForController<K>;
    if: IIfController<K>;
    show: IShowController<K>;
    switch: ISwitchController<K>;
}

export interface IControllers extends ICompControllers<'builder'> {
    model: IModelController;
}
export const compControllers: ICompControllers = {
    for: forController,
    if: ifController,
    show: showController,
    switch: switchController,
};

export const controllers: IControllers = Object.assign({
    model: modelController,
}, compControllers);

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
    newDoms: IControllerDom,
) {
    const target = (oldDoms instanceof Array) ? oldDoms[0] : oldDoms;
    const parent = target.parentElement;
    if (!parent) throw new Error('parent not found');
    
    parent.insertBefore(parseHTMLElement(newDoms), target);
    (oldDoms instanceof Array) ? oldDoms.forEach(n => {n.remove();}) : oldDoms.remove();
}

export function parseHTMLElement (el: HTMLElement[]|HTMLElement|Node) {
    if (el instanceof Array) {
        const frag = document.createDocumentFragment();
        el.forEach(dom => {frag.appendChild(dom);});
        return frag;
    }
    return el;
}