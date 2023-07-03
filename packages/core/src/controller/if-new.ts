/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 20:06:34
 * @Description: Coding something
 */

import {IWatchTarget} from 'packages/reactive/src';
import {IChildren} from '../dom-util';
import {IElement, Renderer} from '../renderer';
import {IWatchRefTarget, watch, watchRef} from 'packages/reactive/src/watch';
import {child, type} from '../../../utils/src/types/symbol';
import {appendChildren, transformChildren} from '../dom-builder';
import {AlinsType, util} from 'packages/utils/src';

const clearNodeCache = Symbol('');
const parent = Symbol('');

export interface IIfReturn {
  [type]: AlinsType.If;
  [child]: (fromElse?: boolean)=>IChildren,
  [parent]?: IIfReturn;
  [clearNodeCache]: (()=>void)[];
  // [util]: {
  //   parent?: IIfReturn;
  // },
  elif(data: IWatchRefTarget<boolean>, call: ()=>IChildren): IIfReturn;
  else(call: ()=>IChildren): IChildren;
}
let ifIndex = 0;

const empty = Symbol('h');

export function $if (data: IWatchRefTarget<boolean>, call: ()=>IChildren) {
    const id = ifIndex++;
    const startNode = Renderer.createEmptyMountNode();
    const endNode = Renderer.createEmptyMountNode();
    const children: IChildren[] = [startNode, empty as any, endNode];

    const calls: (()=>IChildren)[] = [];

    let index = 0;
    const refs: IWatchRefTarget<boolean>[] = [];
    const acceptIf = (data: IWatchRefTarget<boolean>|null, call: ()=>IChildren) => {
        const i = index ++;
        calls[i] = call;
        if (data) {
            refs[i] = (data);
            // @ts-ignore
            if (children[1] !== empty) return;
            // 首次进行评估值
            if (typeof data === 'function' ? data() : data.value) children[1] = call();
        } else { // else处理
            // @ts-ignore
            if (children[1] === empty) children[1] = call();
            // @ts-ignore 回收
            index = null;
        }
    };

    const switchNode = (i: number) => {
        console.log('switch node', i);
        const parentEle = startNode.parentElement;
        if (!parentEle) {
            // 清除父if元素缓存
            console.log('clearNodeCache', id, i);
        } else {
            // dom 元素可见时
            while (startNode.nextSibling !== endNode) {
                startNode.nextSibling.remove();
            }
            const cnode = calls[i]();
            const node = Renderer.createDocumentFragment();
            appendChildren(node as any, cnode);
            parentEle.insertBefore(node as any, endNode);
        }
    };

    const onDataChange = (bs: boolean[]) => {
        console.log('onDataChange', bs);
        for (let i = 0; i < bs.length; i++) {
            if (bs[i]) {
                switchNode(i);
                return;
            }
        }
        return switchNode(calls.length - 1);
    };

    acceptIf(data, call);

    const ifReturn = {
        [type]: AlinsType.If,
        [child] (fromElse = false) {
            // @ts-ignore
            watch(() => (
                refs.map(item => typeof item === 'function' ? item() : item.value)
            ), onDataChange, false);
            if (!fromElse) {
                calls.push(() => null); // else 默认没有
            }
            return children;
            // const array = watch(() => (
            //     refs.map(item => typeof item === 'function' ? item() : item.value)
            // ), onDataChange, false)[0];

            // onDataChange(array);
            // debugger;
            // if (!fromElse) {
            // }
            // return [startNode, endNode];
        },
        elif (data: IWatchRefTarget<boolean>, call: ()=>IChildren) {
            acceptIf(data, call);
            return ifReturn;
        },
        else (call: ()=>IChildren) {
            acceptIf(null, call);
            return this[child](true);
        }
    };

    return ifReturn;
}
