/*
import { IWatchRefTarget } from 'packages/reactive/src/watch';
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 21:55:39
 * @Description: Coding something
 */

import {IIfCall, IIfReturn, IIfTarget} from './type';


export function _if (data: IIfTarget, call: IIfCall): IIfReturn {

    const acceptIf = (data: IIfTarget|null, call: IIfCall) => {

    };
    acceptIf(data, call);
    const result: IIfReturn = {
        elif (data, call) {
            acceptIf(data, call);
            
        },
        else (call) {
            acceptIf(null, call);
        },
        end () {

        }
    };
    return result;
}