/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 20:06:34
 * @Description: Coding something
 */

import {IWatchTarget} from 'packages/reactive/src';
import {IChildren} from '../dom-util';
import {IElement, Renderer} from '../renderer';
import {IWatchRefTarget, watch, watchRef} from 'packages/reactive/src/watch';
import {child} from '../../../utils/src/types/symbol';
import {appendChildren, transformChildren} from '../dom-builder';

export interface IIfReturn {
  [child]: (fromElse?: boolean)=>IChildren,
  elif(data: IWatchRefTarget<boolean>, call: ()=>IChildren): IIfReturn;
  else(call: ()=>IChildren): IChildren;
}

export function $if (data: IWatchRefTarget<boolean>, call: ()=>IChildren) {
    const startNode = Renderer.createEmptyMountNode();
    const endNode = Renderer.createEmptyMountNode();
    const empty = Symbol('h');
    const children: IChildren[] = [startNode, empty as any, endNode];

    const nodeGetter: (()=>IChildren)[] = [];

    const switchNode = (index: number) => {
        if (startNode.parentElement) {
            // dom 元素可见时
            while (startNode.nextSibling !== endNode) {
                startNode.nextSibling.remove();
            }
            const cnode = nodeGetter[index]();
            const node = Renderer.createDocumentFragment();
            appendChildren(node as any, cnode);
            startNode.parentElement.insertBefore(node as any, endNode);
        } else {
            // todo
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
        return switchNode(nodeGetter.length - 1);
    };

    let index = 0;

    const refs: IWatchRefTarget<boolean>[] = [];
    const acceptIf = (data: IWatchRefTarget<boolean>|null, call: ()=>IChildren) => {
        const i = index ++;
        let node: IChildren; // 缓存node
        const getter = () => {
            if (typeof node === 'undefined') node = call();
            return node;
        };
        nodeGetter[i] = getter;
        if (data) {
            refs[i] = (data);
            // 首次进行评估值
            // @ts-ignore
            if (children[1] !== empty) return;
            if (typeof data === 'function' ? data() : data.value) {
                children[1] = nodeGetter[i]();
            }
        } else {
            // @ts-ignore
            if (children[1] === empty) {
                children[1] = getter();
            }
            // @ts-ignore 回收
            index = null;
        }
    };

    acceptIf(data, call);

    const ifReturn: IIfReturn = {
        [child] (fromElse = false) {
            // @ts-ignore
            watch(() => (
                refs.map(item => typeof item === 'function' ? item() : item.value)
            ), onDataChange, false);
            if (!fromElse) {
                nodeGetter.push(() => null);
            }
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


// if(aa){
//   return <div></div>
// }else if(bb){
//   return <span></span>
// }
// return null;

// return $if(aa, () => {
//   return div();
// }).elif(bb, () => {
//   return span();
// }).else(() => {
//   return null;
// });


// if(aa){
//   return <div></div>
// }

// return <div></div>;

// // return $if(list).then(() => {
// //   return div();
// // }).else(() => {
// //   return div();
// // });

// return $if(list, () => {
//   return div();
// }).else(() => {
//   return div();
// });