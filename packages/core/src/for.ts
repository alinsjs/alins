/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import {createProxy, isProxy, watch, watchArray, wrapReactive} from 'packages/reactive/src';
import {IOprationAction, OprateType, registArrayMap} from 'packages/reactive/src/array-proxy';
import {IProxyData, IRefData, trig, util} from 'packages/utils/src';
import {IFragment, IGeneralElement, ITrueElement, Renderer, ITextNode, IElement} from './element/renderer';


/*
 赋值的话是 状态替换
 通过函数调用的话特殊处理
 分为两种插入和删除
 */


export function _for () {
    // list =
}

export function map (
    this: IProxyData<any[]>,
    call: (scope: any)=>IGeneralElement,
    jsx = false,
    k = '$I',
    ik = ''
) {
    const list = this;
    if (!jsx) return list.map(call);
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
    // const proxy = list[util].proxy;
    const ScopeEnd = Renderer.createEmptyMountNode();
    const EndMap: ITrueElement[] = [];

    const scopeItems: IProxyData<{item: any, index: number}>[] = [];
    list[util].scopeItems = scopeItems;
    scopeItems.key = k;
    // window.scope = scopeItems;
    // window.EndMap = EndMap;

    const createScope = (item: any, i: number) => {
        const data: any = {[k]: item};
        if (ik) data[ik] = i;
        return createProxy(wrapReactive(data), {shallow: true});
    };

    const createChild = (item: any, i: number) => {
        // if (!isProxy(item)) {
        //     item = wrapReactive();
        // }
        const scope = createScope(item, i);

        i = createProxy(wrapReactive(i));
        // item[util].index = i; // 缓存index

        let child = call(scope);
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
        return [child, end, scope];
    };
    for (let i = 0; i < n; i++) {
        const item = list[i];
        const [child, end, scope] = createChild(item, i);
        scopeItems[i] = scope;
        container.appendChild(child as any);
        EndMap[i] = end;
    }
    watchArray(list, ({index, count, data, type, fromAssign}: IOprationAction) => {
        switch (type) {
            case OprateType.Push: {
                const doc = Renderer.createDocumentFragment();
                const length = list.length;
                for (let i = 0; i < data.length; i++) {
                    const [child, end, scope] = createChild(data[i], length + i);
                    EndMap.push(end);
                    scopeItems.push(scope);
                    doc.appendChild(child);
                }
                ScopeEnd.parentElement.insertBefore(doc, ScopeEnd);
            };break;
            case OprateType.Replace: {
                // console.warn('【watch array replace', index, JSON.stringify(data));
                if (!scopeItems[index]) {
                    scopeItems[index] = createScope(data[0], index);
                } else {
                    // if (data[0] !== scopeItems[index][k]) {
                    //     scopeItems[index][k] = data[0];
                    // }
                    scopeItems[index][k] = data[0];
                    scopeItems[index][ik] = index;
                }
                // replaceItem(index, data[0]);
            };break;
            case OprateType.Remove: {
                if (count === 0) break;
                const startPos = index - 1;
                const endPos = startPos + count;
                const endDom = EndMap[endPos]?.nextSibling || ScopeEnd;
                // debugger;
                // if (endDom === ScopeEnd) debugger; // debug

                const parent = ScopeEnd.parentElement;
                if (startPos < 0) {
                    if (endPos === list.length - 1) {
                        parent.innerText = '';
                        parent.appendChild(ScopeEnd);
                    } else {
                        const children = parent.children;
                        while (children[0] && children[0] !== endDom) {
                            children[0].remove();
                        }
                    }
                } else {
                    const startDom = EndMap[startPos];
                    while (startDom.nextSibling && startDom.nextSibling !== endDom) {
                        startDom.nextSibling.remove();
                    }
                }
                EndMap.splice(index, count);
                scopeItems.splice(index, count);
                // items.forEach(item => item[util].release());
                // console.warn('【watch array remove】', index, count, data);
            };break;
            case OprateType.Insert: {
                // if (!EndMap[index - 1]) debugger;
                const mountNode = index === 0 ? ScopeEnd.parentElement.children[0] : EndMap[index - 1].nextSibling;
                const ends: any[] = [];
                const scopes: any[] = [];
                data.forEach((item, i) => {
                    const [child, end, scope] = createChild(item, index + i);
                    mountNode.parentElement.insertBefore(child, mountNode);
                    scopes.push(scope);
                    ends.push(end);
                });
                scopeItems.splice(index, 0, ...scopes);
                EndMap.splice(index, 0, ...ends);
                // console.warn('【watch array insert】', index, count, data);
            };break;
        }
        // console.log('type=', ['replace', 'remove', 'insert', 'push'][type], `index=${index}; count=${count}`, 'data=', data, fromAssign);
    });
    // EndMap.push(end);
    container.appendChild(ScopeEnd as any);
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