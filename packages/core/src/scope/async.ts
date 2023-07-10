import {ITrueElement, Renderer} from '../element/renderer';
import {IAsyncReturnCall, ICtxUtil} from '../type';
import {createAnchor} from './anchor';
import {IBranchTarget} from './branch';

/*
import { ICtxUtil } from '../type.d';
import { createAnchor } from './anchor';
import { IBranchTarget } from './branch';
 * @Author: chenzhongsheng
 * @Date: 2023-07-07 22:55:18
 * @Description: Coding something
 */
export function createAsyncScope (call: IAsyncReturnCall, isReturnEl: boolean, {cache, branch}: ICtxUtil) {
    // todo
    let anchor = createAnchor(cache);
    let target: IBranchTarget;
    let cacheCall = () => Renderer.createEmptyMountNode();
    call().then((res: ITrueElement|any) => {
        if (Renderer.isElement(res) && isReturnEl) {
            // realCall = () => res;
            // debugger;
            cache.modifyCache(cacheCall, res);
            anchor.replaceBranch(target);
            // if (target.isVisible()) {
            //     debugger;
            //     anchor.replaceContent(res, target);
            // } else {
            //     debugger;
            //     cache.modifyCache(call, res);
            // }
        }
        // // 释放内存
        // @ts-ignore
        target = cacheCall = anchor = null;
        // ! 此处访问一次之后相关内存就不会再使用 可以回收了
    });
    if (isReturnEl) {
        target = branch.next(cacheCall as any, anchor, true);
        // console.log(target.parent);
        const res = cache.call(target, cacheCall) as ITrueElement;
        branch.back();
        // ! 首次不需要branch
        return anchor.replaceContent(res);
    }
}