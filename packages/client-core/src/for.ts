/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import {
    createProxy, isProxy, watchArray,
    IOprationAction, OprateType, registArrayMap
} from 'alins-reactive';
import {IProxyData, util} from 'alins-utils';
import {IFragment, IGeneralElement, ITrueElement, Renderer} from './element/renderer';
import {getParent} from './utils';
import {createCleaner, ICleaner} from './scope/cleaner';

/*
 赋值的话是 状态替换
 通过函数调用的话特殊处理
 分为两种插入和删除
 */
export function map (
    this: IProxyData<any[]>,
    call: (scope: any, i?: number)=>IGeneralElement,
    jsx = false,
    k = 'item',
    ik = ''
) {
    const list = this;
    // window._list = list;
    // todo list 需要reactive
    // debugger;
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
    const Cleaners: ICleaner[] = [];


    let head: ITrueElement;

    const ScopeItems: IProxyData<{item: any, index: number}>[] = [];
    // window.EndMap = EndMap;
    // window.ScopeItems = ScopeItems;
    list[util].scopeItems = ScopeItems;
    // list[util]._replaceScopeData = (newValue) => {
    //     newValue[]
    //     list = newValue;
    // };
    // @ts-ignore
    list[util]._map = true; // ! 标识需要强制更新，从而更新map的index
    // @ts-ignore ! 此处用于在slice方法中获取 item
    ScopeItems.key = k;
    // window.scope = ScopeItems;
    // window.EndMap = EndMap;

    const createScope = (item: any, i: number): IProxyData<any> => {
        item = createProxy({v: item}, {shallow: true});
        const scope = {[k]: item};

        if (ik) { // 表示有第二个参数
            scope[ik] = createProxy({v: i}, {shallow: true});
        }
        return scope;
    };

    const createChild = (
        item: any,
        i: number,
        scopes = ScopeItems,
        ends = EndMap,
        cleaners = Cleaners,
    ): ITrueElement => {
        // console.log('cc', item, i);
        const scope = createScope(item, i);

        cleaners.push(createCleaner());

        let child = call(scope[k], scope[ik] || i);


        // @ts-ignore
        let end: ITrueElement = child;
        if (!child) {
            child = Renderer.createEmptyMountNode();
            end = child;
            if (i === 0) head = child;
        } else if (Renderer.isFragment(child)) {
            child = child as IFragment;
            const children = child.childNodes;
            const n = children.length;
            if (n === 0) {
                end = Renderer.createEmptyMountNode();
                child.appendChild(end as any);
                if (i === 0) head = end;
            } else {
                end = children[n - 1] as any;
                // @ts-ignore
                if (i === 0) head = children[0];
            }
        } else {
            if (i === 0) head = child;
        }
        // if(i===0)debugger;
        // console.log(head, i);
        
        scopes.push(scope);
        ends.push(end);
        
        return child;
    };
    for (let i = 0; i < n; i++) {
        const item = list[i];
        const child = createChild(item, i);
        container.appendChild(child as any);
    }
    watchArray(list, ({index, count, data, type}: IOprationAction) => {
        switch (type) {
            case OprateType.Push: {
                // console.log(index, count, data, type);
                const doc = Renderer.createDocumentFragment();
                const length = list.length;
                for (let i = 0; i < data.length; i++) {
                    const child = createChild(data[i], length + i);
                    // @ts-ignore
                    doc.appendChild(child);
                }
                // 如果没有父元素则 append到初始的frag上 // todo check 这里的逻辑
                getParent(ScopeEnd, container).insertBefore(doc, ScopeEnd);
            };break;
            case OprateType.Replace: {
                if (!ScopeItems[index]) {
                    // console.warn('【debug: watch array replace1', index, JSON.stringify(data));
                    ScopeItems[index] = createScope(data[0], index);
                } else {
                    // console.warn('【debug: watch array replace2', index, JSON.stringify(data));
                    // const v = isProxy(data[0]) ? data[0].v : data[0];
                    if (data[0] !== ScopeItems[index][k].v) {
                        // console.log('debug: watch array replace------------');
                        ScopeItems[index][k].v = data[0];
                    }
                    if (ik) ScopeItems[index][ik].v = index;
                }
                // replaceItem(index, data[0]);
            };break;
            case OprateType.Remove: {
                // console.log(index, count, data, type);
                if (count === 0) break;
                const startPos = index - 1;
                const endPos = startPos + count;
                // @ts-ignore
                const endDom = EndMap[endPos]?.nextSibling || ScopeEnd;
                // debugger;
                // if (endDom === ScopeEnd) debugger; // debug


                const startDom = ((startPos < 0) ? (head || ScopeEnd) : EndMap[startPos]) as Node;

                while (startDom.nextSibling && startDom.nextSibling !== endDom) {
                    startDom.nextSibling.remove();
                }

                if (startPos < 0) {
                    // @ts-ignore
                    if (startDom !== ScopeEnd) {
                        // @ts-ignore
                        head = startDom.nextSibling;
                        // @ts-ignore
                        startDom.remove();
                    } else {
                        head = ScopeEnd;
                    }
                }

                EndMap.splice(index, count);
                ScopeItems.splice(index, count);
                Cleaners.splice(index, count).forEach(cleaner => {
                    cleaner.clean();
                });
                // items.forEach(item => item[util].release());
                // console.warn('【watch array remove】', index, count, data);
            };break;
            case OprateType.Insert: {
                // if (!EndMap[index - 1]) debugger;
            // @ts-ignore
                const mountNode = index === 0 ? (head || ScopeEnd) : EndMap[index - 1].nextSibling;
                const ends: any[] = [];
                const scopes: any[] = [];
                const cleaners: any[] = [];
                data.forEach((item, i) => {
                    const child = createChild(item, index + i, scopes, ends, cleaners);
                    getParent(mountNode, container).insertBefore(child, mountNode);
                });
                ScopeItems.splice(index, 0, ...scopes);
                EndMap.splice(index, 0, ...ends);
                Cleaners.splice(index, 0, ...cleaners);
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

