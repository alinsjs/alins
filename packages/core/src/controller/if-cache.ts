/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 20:06:34
 * @Description: Coding something
 */

import {IWatchTarget} from 'packages/reactive/src';
import {IChildren} from '../dom-util';
import {IElement, Renderer} from '../renderer';
import {IWatchRefTarget, watch, watchRef} from 'packages/reactive/src/watch';
import {child, type} from 'alins-utils/src/types/symbol';
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

    const nodeGetter: ((force?: boolean)=>IChildren)[] = [];

    const clearNodeCacheList: (()=>void)[] = [];

    // let nodeCache: IChildren[] = [];

    // eslint-disable-next-line prefer-const
    let ifReturn: IIfReturn;

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
            const cnode = nodeGetter[i]();
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
        return switchNode(nodeGetter.length - 1);
    };

    let index = 0;

    const refs: IWatchRefTarget<boolean>[] = [];
    const acceptIf = (data: IWatchRefTarget<boolean>|null, call: ()=>IChildren) => {
        const i = index ++;
        let node: IChildren|undefined; // 缓存node 提升性能
        // ! 子元素清除父元素cache
        clearNodeCacheList[i] = () => {
            console.log('refresh cache', id, i);
            node = undefined;
        };
        const getter = () => {
            console.log(`getter: ifId=${id}`, i, node, call);
            if (typeof node === 'undefined') {
                node = call();
                console.log('set cache', id, i);

                if (ifReturn?.[parent]) {
                    debugger;
                    ifReturn[parent][clearNodeCache]?.[i]();
                }

                // if (id === 1 & i === 1) {
                //     debugger;
                // }

                // if (node?.[type] === AlinsType.If) {
                //     // todo
                //     console.log(node?.[parent]);
                //     debugger;
                // }

                // @ts-ignore
                if (node?.[type] === AlinsType.If && !(node as IIfReturn)[clearNodeCache]) {
                    // 当子元素是if时
                    console.log('子元素是if', id, i);
                    
                    // @ts-ignore
                    (node as IIfReturn)[parent] = ifReturn;
                    // ifReturn[parent]?.[clearNodeCache]?.();
                }
            } else {
                console.log('use cache', id, i);


            }
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
        } else { // else处理
            // @ts-ignore
            if (children[1] === empty) {
                children[1] = getter();
            }
            // @ts-ignore 回收
            index = null;
        }
    };

    acceptIf(data, call);

    ifReturn = {
        [type]: AlinsType.If,
        [child] (fromElse = false) {
            // @ts-ignore

            watch(() => (
                refs.map(item => typeof item === 'function' ? item() : item.value)
            ), onDataChange, false);
            if (!fromElse) {
                nodeGetter.push(() => null);
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
        [clearNodeCache]: clearNodeCacheList,
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