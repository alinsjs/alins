/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import {IWatchRefTarget} from 'packages/reactive/src';
import {ISimpleValue} from 'packages/utils/src';
import {IReturnCall} from './type';


export type ISwitchTarget = IWatchRefTarget<ISimpleValue>;
export interface ISwitchReturn {
    default(call: IReturnCall): IGeneralElement|void;
    end(): void;
}

export function _switch () {
    
}