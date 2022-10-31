

/*
 * @Author: tackchen
 * @Date: 2022-07-11 17:17:54
 * @Description: Coding something
 */
import {react} from './react';
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
export {version} from '../package.json';