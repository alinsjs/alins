

/*
 * @Author: tackchen
 * @Date: 2022-07-11 17:17:54
 * @Description: Coding something
 */
import {computed} from './computed';
import {createProxy} from './proxy';
import {react} from './react';
import {watch} from './watch';
export * from 'alins-utils';

export {
    react,
    createReactive,
    countBindingValue,
    transformToReaction,
    isReaction,
    mergeReact,
    reactionValueToItem,
    parseReactionValue,
    exeReactionValue,
} from './react';

export {
    reactiveTemplate,
    createReplacement,
    createTemplateReplacement,
    extractReplacement,
    parseReplacementToNumber,
    ReplaceExp,
} from './binding';


export {
    computed,
    subscribeReactBuilder,
    computedReactBuilder,
} from './computed';

export {
    watch,
} from './watch';

export {
    createProxy
} from './proxy';

export const $ = react;

export default {react, computed, watch, createProxy, $};