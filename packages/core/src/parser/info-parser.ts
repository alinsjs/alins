/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:31:44
 * @Description: parse dom info
 * .class[a=1]#aa:dsd =>
 * {
 *  class: "class",
 *  attribute: {
 *      a: '1',
 *  },
 *  id: 'aa',
 *  content: 'dsd'
 * }
 */

import {split} from 'alins-utils';
import {IJson} from 'alins-utils/src/types/common.d';

export interface IDomInfoData {
    className?: string[];
    attributes?: IJson<string>;
    id?: string;
    textContent?: string;
    tagName?: string;
}


export const InfoKeys = ['className', 'attributes', 'id', 'textContent', 'tagName'] as const;
export type TInfoType = typeof InfoKeys[number];

(window as any).parseCount = 0;
export function parseDomInfo (info: string): IDomInfoData {
    (window as any).parseCount++;
    if (!('./#[:'.includes(info[0]))) info = `:${info}`;
    const result: IDomInfoData = {textContent: ''};

    let scope: TInfoType | '' = '';
    let lastIndex = 0;

    const modScope = (index: number, newScope: TInfoType | '') => {
        scope = newScope;
        lastIndex = index;
    };

    const appendInfo = (index: number, newScope: TInfoType | '') => {
        // ignore scope in []
        if (scope === 'attributes' && newScope !== '') return;
        if (!scope) return modScope(index, newScope);
        const value = info.substring(lastIndex + 1, index);
        switch (scope) {
            case 'className': {
                if (!result.className) result.className = [];
                result.className.push(value);
            }; break;
            case 'id': result.id = value; break;
            case 'attributes': {
                if (!result.attributes) result.attributes = {};
                const [key, kv] = split(value, '=');
                result.attributes[key] = kv;
            }; break;
            case 'textContent': {
                result.textContent += value;
            };break;
            case 'tagName': {
                result.tagName = value;
            };break;
        }
        modScope(index, newScope);
    };
    const len = info.length;
    for (let i = 0; i < len; i++) {
        switch (info[i]) {
            case '.': appendInfo(i, 'className'); break;
            case '#': appendInfo(i, 'id'); break;
            case '[': appendInfo(i, 'attributes'); break;
            case ']': appendInfo(i, ''); break;
            case '/':
                appendInfo(i, 'tagName'); break;
            case ':':
                // ! :中的所有 : 都认为是文本
                if (scope !== 'textContent' as TInfoType | '') { // ? 这里不知为何scope居然判定为 '' 了
                    appendInfo(i, 'textContent');
                } break;
        }
    }
    appendInfo(info.length, '');
    return result;
}

