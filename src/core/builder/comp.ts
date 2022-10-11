/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:45:14
 * @Description: Coding something
 */

import {IElement} from '../element/base';

export interface IComponent {
    (options?: {
        props: any;
        event?: any;
        slot?: any;
    }): IElement;
}

export type TCompArg = string; // props event slot
export interface ICompBuilder {
    (comp: IComponent, ...args: TCompArg[]): IElement;
    // todo controller
}

const CompMap: Map<Function, IElement> = new Map(); // 或者可以使用 func.toString md5

export const comp: ICompBuilder = (...data) => {
  const el = data[0];
  
  if (typeof el !== 'function') throw new Error('');

  const mapValue = CompMap.get(el);
  if (mapValue) return mapValue;

  const comp: IElement = { // todo
    tag: el.name,
  };

  CompMap.set(el, comp);

  return comp;
};