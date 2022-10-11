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
interface InfoData {
    className?: string;
    attributes?: IJson<string>;
    id?: string;
    textContent?: string;
}

type TInfoType = keyof InfoData;


export function parseDomInfo (info: string): InfoData {

  const result: InfoData = {};

  let scope: TInfoType | '' = '';
  let lastIndex = 0;

  const modScope = (index: number, newScope: TInfoType | '') => {
    scope = newScope;
    lastIndex = index;
  };

  const appendInfo = (index: number, newScope: TInfoType | '') => {
    if (!scope) return modScope(index, newScope);
    const value = info.substring(lastIndex + 1, index);
    switch (scope) {
      case 'className': {
        result.className = result.className ? `${result.className} ${value}` : value;
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
    }
    modScope(index, newScope);
  };

  for (let i = 0; i < info.length; i++) {
    switch (info[i]) {
      case '.': appendInfo(i, 'className'); break;
      case '#': appendInfo(i, 'id'); break;
      case '[': appendInfo(i, 'attributes'); break;
      case ']': appendInfo(i, ''); break;
      case ':': appendInfo(i, 'textContent'); break;
    }
  }
  appendInfo(info.length, '');

  return result;
}

