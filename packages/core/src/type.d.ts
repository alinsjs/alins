/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:13:50
 * @Description: Coding something
 */

  
import {IBranchLink} from './scope/branch';
import {ICtxAnchor} from './scope/anchor';
import {ICallCache} from './scope/cache';
import {ITrueElement} from './element/renderer';

// eslint-disable-next-line no-undef
export type IReturnCall = () => JSX.Element|null|ITrueElement|void;
export type IAsyncReturnCall = () => Promise<ITrueElement|void>;

export interface ICtxUtil {
    cache: ICallCache;
    anchor: ICtxAnchor;
    branch: IBranchLink;
}
