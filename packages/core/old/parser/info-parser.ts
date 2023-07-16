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

const SplitStr = './#[:';

export function checkDefaultTextItem (item: string) {
    return (SplitStr.includes(item[0])) ? item : `:${item}`;
}

// const ExtractTextReg = /(:(.*?))(?=([\.\/#\[:]|$))/g;

// export function extractText (content: string) {
//     if (!isSafari) {
//         const result = content.replace(/\[.*?\]/g, '').matchAll(ExtractTextReg);
//         let text = '';
//         let done = false;
//         do {
//             const next = result.next();
//             done = next.done ?? true;
//             if (next.value) {
//                 content = content.replace(next.value[1], '');
//                 text += next.value[2] || '';
//             }
//         } while (!done);
//         return {text, content};
//     } else {
//         // 兼容 safari 不支持零宽断言
//         let text = '';
//         let result = '';
//         let inText = false;
//         let inAttr = false;
//         for (let i = 0; i < content.length; i++) {
//             const s = content[i];
//             if (SplitStr.includes(s)) {
//                 if (s === ':') {
//                     inText = true;
//                     if (inAttr) result += s;
//                 } else {
//                     if (s === '[') inAttr = true;
//                     else if (s === ']') inAttr = false;
//                     inText = false;
//                     result += s;
//                 }
//             } else {
//                 if (inText) text += s;
//                 else result += s;
//             }
//         }
//         return {text, content: result};
//     }
// }

export function getTagNameFromDomInfo (domInfo: string) {
    if (domInfo[0] !== '/') return '';
    for (let i = 1; i < domInfo.length; i++) {
        if ('.#[:'.includes(domInfo[i])) return domInfo.substring(1, i);
    }
    return domInfo.substring(1);
}

export function parseDomInfo (info: string): IDomInfoData {
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
                // ! :中的所有 : 都认为是文本
                if (scope !== 'textContent' as TInfoType | '') { // ? 这里不知为何scope居然判定为 '' 了
                    appendInfo(i, 'textContent');
                } break;
        }
    }
    appendInfo(info.length, '');
    return result;
}

