/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:32:24
 * @Description: Coding something
 */

import {IElement} from '../element/base';

export type TBuilderArg = string | any[];

export interface IBuilder {
    (...args: TBuilderArg[]): IElement;
    // todo controller
}

export const div: IBuilder = (...data) => {

  for (let i = 0; i < data.length; i++) {
        
  }

  return {
    tag: 'DIV'
  };
};