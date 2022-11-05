/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:16:59
 * @Description: Coding something
 */
import {LifeMountedCollector} from './builder/life';
import {TChild, mountChildrenDoms, IMountParent} from './element/transform';

export function mount (...builders: (string | Element | TChild)[]) {
    let parent: Element | string | null = builders[0] as any;
    if (typeof parent === 'string') {
        parent = document.querySelector(parent);
        if (!(parent instanceof Element)) throw new Error('Parent is not defined');
    }
    
    if (parent instanceof HTMLElement) {builders.shift();}
    else parent = document.body;
    
    mountParentWithTChild(parent as HTMLElement, builders as TChild[]);
}
export function mountParentWithTChild (
    parent: IMountParent,
    ...builders: TChild[]
) {
    if (typeof parent === 'string') {
        parent = document.querySelector<HTMLElement>(parent) || document.body;
    }
    if (parent instanceof HTMLElement) {
        LifeMountedCollector.mountStart();
        mountChildrenDoms(parent, builders);
        LifeMountedCollector.mountFinish();
    } else if (parent.type === 'builder' || parent.type === 'comp') {
        parent._asParent(builders);
    } else {
        throw new Error('Parent is illegal');
    }
}