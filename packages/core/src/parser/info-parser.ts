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

import {splitTwoPart, IJson} from 'alins-utils';

export interface IDomInfoData {
    className?: string[];
    attributes?: IJson<string>;
    id?: string;
    textContent?: string;
    tagName?: string;
}


export const InfoKeys = ['className', 'attributes', 'id', 'textContent', 'tagName'] as const;
export type TInfoType = typeof InfoKeys[number];

export function checkDefaultTextItem (item: string) {
    return  ('./#[:'.includes(item[0])) ? item : `:${item}`;
}

export function getTagNameFromDomInfo (domInfo: string) {
    if (domInfo[0] !== '/') return '';
    for (let i = 1; i < domInfo.length; i++) {
        if ('.#[:'.includes(domInfo[i])) return domInfo.substring(1, i);
    }
    return domInfo.substring(1);
}

// (window as any).parseCount = 0;
export function parseDomInfo (info: string): IDomInfoData {
    // (window as any).parseCount++;
    const result: IDomInfoData = {textContent: ''};
    info = checkDefaultTextItem(info);

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
                const [key, kv] = splitTwoPart(value, '=');
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
                // ! :???????????? : ??????????????????
                if (scope !== 'textContent' as TInfoType | '') { // ? ??????????????????scope??????????????? '' ???
                    appendInfo(i, 'textContent');
                } break;
        }
    }
    appendInfo(info.length, '');
    return result;
}

