/*
 * @Author: tackchen
 * @Date: 2022-10-21 14:08:36
 * @Description: Coding something
 */

import {IBuilderParameter} from 'alins-utils';
import {onDomEvent} from './dom-proxy';

export const LifeMountedCollector: {
    _mountedList: Function[];
    _inMounting: boolean;
    mountStart: ()=>void;
    collectMounted: (
        dom: HTMLElement, life?: ILifeBuilder
    )=>void;
    mountFinish: ()=>void;
} = {
    _mountedList: [],
    _inMounting: false,
    mountStart () {
        this._inMounting = true;
        this._mountedList = [];
    },
    collectMounted (dom, mounted) {
        if (!this._inMounting) {
            onDomEvent('mounted', dom, mounted?.exe());
            return;
        }
        this._mountedList.push(() => {
            mounted?.exe()(dom);
        });
    },
    mountFinish () {
        this._mountedList.forEach(fn => {fn();});
        this._mountedList = [];
        this._inMounting = false;
    }
};

export type TLifeNames = 'created' | 'mounted' | 'updated' | 'appended' | 'removed';

// 'destoryed' // 路由完成之后再处理

export interface ILifeBuilder extends IBuilderParameter {
    type: 'life',
    name: TLifeNames,
    exe(): Function;
}

export type TUpdatedType = 'value' | 'text' | 'className' | 'attribute-key' |  'attribute-value' |'id';
export type IUpdatedCallback = (data: {
    node: Node | HTMLElement,
    type: TUpdatedType,
    value: any,
    prevValue: any,
    key?: string,
})=>void;

type ILifeCallbackCommon = (dom:HTMLElement)=>void;

interface ILifeCallback {
    created: ILifeCallbackCommon;
    mounted: ILifeCallbackCommon;
    updated: IUpdatedCallback;
    appended: ILifeCallbackCommon;
    removed: ILifeCallbackCommon;
}
export type ILifes = {
    [prop in TLifeNames]?: ILifeBuilder
};

export function life <T extends TLifeNames> (name: T):
    ((listener: ILifeCallback[T])=>ILifeBuilder) {
    return (listener: ILifeCallback[T]) => {
        return {
            type: 'life',
            name,
            exe () {
                return listener;
            }
        };
    };
}

export const created = life('created');
export const mounted = life('mounted');
export const updated = life('updated');
export const appended = life('appended');
export const removed = life('removed');

export function mountLifes (parent: any, lifes: ILifes) {
    onDomEvent('appended', parent, lifes.appended?.exe());
    onDomEvent('removed', parent, lifes.removed?.exe());
}