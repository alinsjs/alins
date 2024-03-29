/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 19:35:29
 * @Description: Coding something
 */

export * from './context';

export * from './element/alins.d';

export { _if } from './branch/if';
export { _switch } from './branch/switch';
export { map } from './for';

export * from './element/renderer';
export * from './element/custom-renderer';

export * from 'alins-reactive';

export * from './element/jsx.d';

export { appended, created, mounted, removed } from './element/lifecycle';

export const version = __VERSION__;

export { reactiveBindingEnable } from './element/dom-util';
export * from 'alins-utils';
