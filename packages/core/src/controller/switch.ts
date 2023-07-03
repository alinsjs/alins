/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 20:06:34
 * @Description: Coding something
 */

import {IChildren} from '../dom-util';
import {Renderer} from '../renderer';
import {IWatchRefTarget, watch} from 'packages/reactive/src/watch';
import {child, type} from '../../../utils/src/types/symbol';
import {appendChildren} from '../dom-builder';
import {AlinsType} from 'packages/utils/src';
import {ISimpleValue} from 'alins-utils';

// todo 增加cache缓存

export interface ISwitchReturn {
  [type]: AlinsType,
  [child]: (fromElse?: boolean)=>IChildren,
  case(v: (ISimpleValue|null)|(ISimpleValue|null)[], call: ()=>IChildren): IIfReturn;
  default(call: ()=>any): any;
}

const empty = Symbol('h');

export function $if (data: IWatchRefTarget<boolean>, call: ()=>IChildren): IIfReturn {
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
        if (parentEle) {
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
            if (!fromElse) calls.push(() => null); // else 默认没有
            return children;
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
