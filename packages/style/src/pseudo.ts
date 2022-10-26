/*
 * @Author ' tackchen
 * @Date ' 2022-10-25 08 '13 '09
 * @Description ' Coding something
 */

import {reactiveTemplate} from 'alins-reactive';
import {parseReactionValue} from 'alins-reactive/src/react';
import {TReactionItem, TReactionValue} from 'alins-utils/src/types/react';
import {IPseudoBuilder} from 'alins-utils/src/types/style';
import {ICssBase, parseSingleCssItem} from './css';
import {createCssPool, DataAlinsDom, getAlinsDomId, insertStyle} from './utils';


const NoArgPseudo = ['active', 'any-link', 'blank', 'checked', 'current', 'default',
    'defined', 'disabled', 'drop', 'empty', 'enabled',
    'first', 'first-child', 'first-of-type', 'fullscreen', 'future', 'focus',
    'focus-visible', 'focus-within', 'host ',
    'hover', 'indeterminate', 'in-range', 'invalid', 'last-child',
    'last-of-type', 'left', 'link', 'local-link', 'only-child',
    'only-of-type', 'optional', 'out-of-range', 'past', 'placeholder-shown', 'read-only',
    'read-write', 'required', 'right', 'root', 'scope', 'target',
    'target-within', 'user-invalid', 'valid', 'visited', 'before', 'after'] as const;

const ArgPseudo = ['dir', 'where', 'has', 'host', 'host-context', 'is', 'lang', 'not', 'nth-child',
    'nth-col', 'nth-last-child', 'nth-last-col', 'nth-last-of-type', 'nth-of-type', 'where'] as const;

type TPseudoName = (typeof NoArgPseudo)[number] | (typeof ArgPseudo)[number];

type IPseudoClass = (...args: ICssBase[]) => IPseudoBuilder;

export interface IPseudoConstructor {
  (name: TPseudoName, arg?: TReactionValue<string|number>): IPseudoClass;
}

const PseudoPool = createCssPool();

export const pseudo: IPseudoConstructor = (name, arg) => {
    return (...args: ICssBase[]) => {
        let template = '';
        const reactions: TReactionItem[] = [];
        
        args.forEach(item => {
            template += parseSingleCssItem(item, reactions);
        });
        let argTemplate = '';
        if (typeof arg !== 'undefined') {
            const argReaction = parseReactionValue(arg, reactions.length);

            if (argReaction.reactions.length > 0) {
                reactions.push(...argReaction.reactions);
            }
            argTemplate = `(${argReaction.template})`;
        } else {
        }

        const setStyle = insertStyle(document.head);
        
        return {
            type: 'pseudo',
            exe (dom: HTMLElement) {
                const id = getAlinsDomId(dom);
                template = `[${DataAlinsDom}="${id}"]:${name}${argTemplate}{${template}}`;
                if (reactions.length > 0) { // 有响应数据需要渲染
                    PseudoPool.add(reactiveTemplate(template, reactions, PseudoPool.update()));
                } else {
                    PseudoPool.add(template);
                    setStyle(template);
                }
                dom.setAttribute(DataAlinsDom, id);
            }
        };
    };
};

export const hover = pseudo('hover');

export const active = pseudo('active');

export const before = pseudo('before');

export const after = pseudo('after');

export const nthChild = (arg: TReactionValue<string|number>) => pseudo('nth-child', arg);