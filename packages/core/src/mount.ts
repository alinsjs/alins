/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:16:59
 * @Description: Coding something
 */
import {LifeMountedCollector} from './builder/life';
import {TChild, mountChildrenDoms} from './element/transform';

export function mount (...builders: (string | Element | TChild)[]) {
    let parent: Element | string | null = builders[0] as any;
    if (typeof parent === 'string') {
        parent = document.querySelector(parent);
        if (!(parent instanceof Element)) throw new Error('Parent is not defined');
    }
    
    if (parent instanceof HTMLElement) {builders.shift();}
    else parent = document.body;
    LifeMountedCollector.mountStart();
    mountChildrenDoms(parent as HTMLElement, builders as TChild[]);
    LifeMountedCollector.mountFinish();
}