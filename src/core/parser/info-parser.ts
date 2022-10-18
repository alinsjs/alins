import {IJson} from '../common';
import {split} from '../utils';

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
export interface IDomInfoData {
    className?: string[];
    attributes?: IJson<string>;
    id?: string;
    textContent?: string;
    tagName?: string;
}

export type TInfoType = keyof IDomInfoData;

export const InfoKeys = ['className', 'attributes', 'id', 'textContent', 'tagName'] as const;

(window as any).parseCount = 0;
export function parseDomInfo (info: string): IDomInfoData {
    (window as any).parseCount++;
    const result: IDomInfoData = {};

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
                result.textContent = value;
            };break;
            case 'tagName': {
                result.tagName = value;
            };break;
        }
        modScope(index, newScope);
    };
    let len = info.length;
    for (let i = 0; i < len; i++) {
        switch (info[i]) {
            case '.': appendInfo(i, 'className'); break;
            case '#': appendInfo(i, 'id'); break;
            case '[': appendInfo(i, 'attributes'); break;
            case ']': appendInfo(i, ''); break;
            case '/': appendInfo(i, 'tagName'); break;
            case ':':
                appendInfo(i, 'textContent');
                // ? 此处有问题 对于分开写的 :， 由于是拼接的 后面的 内容会被前面的 : 覆盖掉
                len = i; // ! 如果有 : 则立即退出循环 : 后面的全部认为是文本内容
                break;
        }
    }
    appendInfo(info.length, '');

    return result;
}

