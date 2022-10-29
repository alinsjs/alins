/*
 * @Author: chenzhongsheng
 * @Date: 2022-10-29 16:42:51
 * @Description: 组合样式
 */

import {$} from 'alins-reactive';
import {reactionValueToItem} from 'alins-reactive/src/react';
import {IJson} from 'alins-utils/src/types/common';
import {IReactBuilder, TReactionItem, TReactionValue} from 'alins-utils/src/types/react';
import {IComposeStyle} from 'alins-utils/src/types/style';

export function createComposeValue (): {
  [prop in keyof IComposeStyle]: (...args: TReactionValue<string|number>[]) => IJson<TReactionItem|IReactBuilder>
  } {
    return {
        cursorUrl: (...args) => {
            const reacts = transformComposeArgs(args);
            return {
                cursor: $`url('${reacts[0]}'), ${reacts[1] || 'default'}`
            };
        }
    };
}

function transformComposeArgs (args: TReactionValue<number|string>[]): TReactionItem<number|string>[] {
    return args.map((arg) => reactionValueToItem(arg));
};