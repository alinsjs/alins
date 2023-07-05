/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:13:50
 * @Description: Coding something
 */

  
import {ICallCache, ICtxAnchor} from './ctx-util';
import {ITrueElement} from './element/renderer';

export type IReturnCall = () => ITrueElement|void;
export type IAsyncReturnCall = () => Promise<ITrueElement|void>;

export interface ICtxUtil {
    cache: ICallCache;
    anchor: ICtxAnchor;
}
