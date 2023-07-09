/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import {createProxy, isProxy, watch, watchArray, wrapReactive} from 'packages/reactive/src';
import {IOprationAction, OprateType, registArrayMap} from 'packages/reactive/src/array-proxy';
import {IProxyData, IRefData, trig, util} from 'packages/utils/src';
import {IFragment, IGeneralElement, ITrueElement, Renderer, ITextNode} from './element/renderer';


/*
 赋值的话是 状态替换
 通过函数调用的话特殊处理
 分为两种插入和删除
 */


export function _for () {
    // list =
}

export function map (this: IProxyData<any[]>, call: (item: any, index: number)=>IGeneralElement, isJSX = false) {
    const list = this;
    if (!isJSX) return list.map(call);
    // list.map
    const container = Renderer.createDocumentFragment();
    const isReactive = isProxy(list);
    const n = list.length;
    if (!isReactive) {
        for (let i = 0; i < n; i++) {
            const child = call(list[i], i);
            if (child) container.appendChild(child as any);
        }
        return container;
    }
    const proxy = list[util].proxy;
    const TotalEnd = Renderer.createEmptyMountNode();
    const EndMap: ITrueElement[] = [];

    const modifyedList: IRefData[] = [];

    let isModifyed = false;

    const replaceItem = (index: number, item: any) => {
        if (isModifyed) {
            modifyedList[index].value = item;
        } else {
            
        }
    };

    const createChild = (item: any, i: number) => {
        // if (!isProxy(item)) {
        //     item = wrapReactive();
        // }
        if (!isProxy(item)) {
            item = createProxy(wrapReactive(item));
            modifyedList[i] = item;
            if (!isModifyed) isModifyed = true;
        }
        i = createProxy(wrapReactive(i));
        item[util].index = i; // 缓存index

        let child = call(item, i);
        // @ts-ignore
        let end: ITrueElement = child;
        if (!child) {
            child = Renderer.createEmptyMountNode();
            end = child;
        } else if (Renderer.isFragment(child)) {
            child = child as IFragment;
            const n = child.children.length;
            if (n === 0) {
                end = Renderer.createEmptyMountNode();
                child.appendChild(end as any);
            } else {
                end = child.children[n - 1] as any;
            }
        }
        return [child, end];
    };
    for (let i = 0; i < n; i++) {
        const item = list[i];
        const [child, end] = createChild(item, i);
        container.appendChild(child as any);
        EndMap[i] = end;
    }
    watchArray(list, ({index, count, data, type, fromAssign}: IOprationAction) => {
        switch (type) {
            case OprateType.Push: {
                const doc = Renderer.createDocumentFragment();
                const length = list.length;
                for (let i = 0; i < data.length; i++) {
                    const [child, end] = createChild(data[i], length + i);
                    doc.appendChild(child);
                    EndMap.push(end);
                }
                TotalEnd.parentElement.insertBefore(doc, TotalEnd);
            };break;
            case OprateType.Replace: {
                replaceItem(index, data[0]);
            };break;
            case OprateType.Remove: {
            };break;
            case OprateType.Insert: {
            };break;
        }
        console.log('type=', ['replace', 'remove', 'insert', 'push'][type], `index=${index}; count=${count}`, 'data=', data, fromAssign);
    });
    // EndMap.push(end);
    container.appendChild(TotalEnd as any);
    return container;
}

registArrayMap(map);
/*
var list = react([{a:1},{a:2}])
    initArrayProxy(list, ({index, count, data, type, fromAssign}) => {
        const ut = list[util];

        switch (type) {
            case OprateType.Push: {
                data.forEach((item, i) => {
                    ut.triggerChange(index + i, item, undefined, false, true);
                });
            };break;
            case OprateType.Replace: {
                if (!fromAssign) {
                    
                }
            };break;
            case OprateType.Push: {

            };break;
            case OprateType.Push: {

            };break;
        }
        console.log('type=', ['replace', 'remove', 'insert', 'push'][type], `index=${index}; count=${count}`, 'data=', data,);
    });
watch(list, (...args)=>console.log('watch======',args));

list.push({a: 3})
*/