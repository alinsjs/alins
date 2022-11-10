/*
 * @Author: chenzhongsheng
 * @Date: 2022-10-29 16:44:18
 * @Description: 固定样式组合
 */

import {INoneArgsAtoms} from 'alins-utils';

export function createFixedValue (): {
  [prop in keyof INoneArgsAtoms]: object
  } {
    return {
        borderBox: {boxSizing: 'border-box'},
        relative: {position: 'relative'},
        absolute: {position: 'absolute'},
        fixed: {position: 'fixed'},
    };
}