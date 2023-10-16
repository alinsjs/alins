/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 18:41:35
 * @Description: Coding something
 */

import { _if } from './branch/if';
import { assignCompData, assignData, computed, mockRef, ref, watch, createStateScope, deconstruct, createStore } from 'alins-reactive';
import { _switch } from './branch/switch';
import './for';
import { JSX } from './element/element';
import { mockMap } from './for';
import { mount } from './element/renderer';
import { appended, created, mounted, removed } from './element/lifecycle';

export const _$ce = JSX.createElement,
    _$mt = mount,
    _$r = ref,
    _$c = computed,
    _$w = watch,
    _$e = assignData,
    _$es = assignCompData,
    _$mf = mockRef,
    _$mm = mockMap,
    _$if = _if,
    _$sw = _switch,
    _$cd = created,
    _$ad = appended,
    _$md = mounted,
    _$rd = removed,
    _$cs = createStore,
    _$cst = createStateScope,
    _$dc = deconstruct;

// ! 处理 async 代码没有返回值
// markNotReturned
export function _$mnr (fn: any) {
    fn.returned = false;
    return fn;
}

export function _$cc (get: any, set: any) { // 简写，减少编译代码量
    return computed({ get, set });
}

// markUpdateExpression: true
export function _$mu (fn:any) {
    fn._update = true;
    return fn;
}

export function _$f (props: any, children: any[]) {
    return _$ce('', props, ...children);
}