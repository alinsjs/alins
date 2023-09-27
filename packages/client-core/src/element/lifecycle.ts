/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-15 09:29:01
 * @Description: Coding something
 */

import type { IElement } from './alins.d';

export function initWebMountedObserver (parent: any) {

    if (typeof parent.__$count === 'undefined') parent.__$count = 1;
    else parent.__$count ++;
    if (parent.__$m_observer) return;

    parent.__$m_observer = new window.MutationObserver(entries => {
        entries.forEach(item => {
            if (item.type === 'childList') {
                item.addedNodes.forEach(node => {
                    if (node.nodeType !== 1 || !parent) return;
                    // @ts-ignore
                    if (node.__$mounted) {
                        // @ts-ignore
                        const fn = node.__$mounted(node);
                        // @ts-ignore
                        node.__$mounted = null;
                        if (typeof fn === 'function') {
                            // @ts-ignore
                            node.__$removed = fn;
                            initWebRemovedObserver(node);
                        }
                        parent.__$count --;
                        if (parent.__$count === 0) {
                            parent.__$m_observer.disconnect();
                            parent.__$m_observer = null;
                            parent = null;
                        }
                    };
                });
            }
        });
    });

    parent.__$m_observer.observe(parent, {
        'childList': true,
    });
}

let removeCount = 0;
let removeObserver: MutationObserver|null = null;

function onNodeRemove (node: any) {
    if (node.__$removed) {
        node.__$removed(node);
        node.__$removed = null;
        removeCount --;
        if (removeCount <= 0) {
            removeObserver!.disconnect();
            removeObserver = null;
        }
        return true;
    }
    return false;
}

export function initWebRemovedObserver (el: any) {
    const rm = '__rm';
    el.setAttribute(rm, '');

    if (removeObserver) {
        removeCount ++;
        return;
    }

    removeCount = 1;

    removeObserver = new window.MutationObserver(entries => {
        entries.forEach(item => {
            if (item.type === 'childList') {
                item.removedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    onNodeRemove(node);
                    // @ts-ignore
                    const els = node.querySelectorAll(`[${rm}]`);
                    els.forEach(item => {
                        onNodeRemove(item);
                    });
                });
            }
        });
    });
    removeObserver!.observe(window.document.body, {
        'childList': true,
        'subtree': true,
    });
}

export const CompLife = (() => {
    const map = {};
    let id = 0;
    let currentId = 0;
    return {
        enter () {
            currentId = id++;
            return currentId;
        },
        add (name: string, callback: any) {
            if (!map[currentId]) {
                map[currentId] = { [name]: [ callback ] };
            } else if (!map[currentId][name]) {
                map[currentId][name] = [ callback ];
            } else {
                map[currentId][name].push(callback);
            }
        },
        fill (lifes: any, id: number, node: any) {
            const fnLifes = map[id];
            if (!fnLifes) return;
            delete map[id];
            for (const k in fnLifes) {
                const v = fnLifes[k];
                const key = `$${k}`;
                const origin = lifes[key];
                lifes[key] = k === 'mounted' ? () => {
                    let list: any = [];
                    const addRM = (r: any) => {if (typeof r === 'function') list.push(r);};
                    addRM(origin?.(node));
                    v.forEach((fn: Function) => {addRM(fn(node));});
                    if (list.length > 0) return () => {list.forEach((fn: Function) => fn(node)); list = null;};
                } : () => {
                    origin?.(node);
                    v.forEach((fn: Function) => {fn(node);});
                };
            }
        }
    };
})();

const LifeCreator = <T=void>(name: string) =>
    (v: (dom: IElement)=>T) => { CompLife.add(name, v); };

export const created = LifeCreator('created');
export const appended = LifeCreator('appended');
export const mounted = LifeCreator<void|((dom: IElement)=>void)>('mounted');
export const removed = LifeCreator('removed');