/*
 * @Author: chenzhongsheng
 * @Date: 2022-10-29 16:29:35
 * @Description: css 兼容写法
 */

import {IJson} from 'alins-utils';

// 需要兼容的css属性
const CompatibleStyleNames = [
    'animation', 'transform', 'filter', 'transition',
];

const Prefixes = ['webkit', 'moz', 'ms', 'o'];

const CompateRegExp = new RegExp(`(${CompatibleStyleNames.join('|')}) *:.*?(;|$)`, 'g');

export function compateStaticStyle (style: string): string {
    return style.replace(CompateRegExp, (item) => {
        let result = item;
        Prefixes.forEach(name => {
            result += `-${name}-${item}`;
        });
        return result;
    });
}
export function compateKVStyle (style: IJson<string>, key: string, value: string) {
    if (CompatibleStyleNames.includes(key)) {
        Prefixes.forEach(name => {
            style[`-${name}-${key}`] = value;
        });
    }
}


