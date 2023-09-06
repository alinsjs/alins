/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 18:41:35
 * @Description: Coding something
 */

import { _if } from './branch/if';
import { assignCompData, assignData, computed, isProxy, mockRef, reactive, watch } from 'alins-reactive';
import { _switch } from './branch/switch';
import './for';
import { JSX } from './element/element';
import { mockMap } from './for';

export const _$ce = JSX.createElement;

// ! 处理 async 代码没有返回值
// markNotReturned
export function _$mnr (fn: any) {
    fn.returned = false;
    return fn;
}

export function _$r (v: any, shallow?: boolean) {
    if (typeof shallow !== 'boolean') {
        shallow = typeof v.v === 'object' && isProxy(v.v);
    }
    return reactive({ v }, shallow);
}
export const _$c = computed;
export const _$w = watch;

export function _$cc (get: any, set: any) { // 简写，减少编译代码量
    return computed({ get, set });
}

export const _$e = assignData;
export const _$es = assignCompData;

// markUpdateExpression: true
export function _$mu (fn:any) {
    fn._update = true;
    return fn;
}
export const _$mf = mockRef;
export const _$mm = mockMap;
export const _$if = _if;
export const _$sw = _switch;