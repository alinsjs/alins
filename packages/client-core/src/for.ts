/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import {
    createProxy, isProxy, watchArray,
    IOprationAction, OprateType, registArrayMap,
    createCleaner, ICleaner, mockRef
} from 'alins-reactive';
import {IProxyData, util} from 'alins-utils';
import {IFragment, IGeneralElement, ITrueElement, Renderer} from './element/renderer';
import {createDomCacheManager} from './scope/cache';
import {getParent} from './utils';


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
    // console.log('__DEV__', __DEV__);
    const list = this;
    // window._list = list;
    // todo list 需要reactive
    if (!jsx) return list.map(call);
    // list.map
    const container = Renderer.createDocumentFragment();
    const isReactive = isProxy(list);
    const n = list.length;
    if (!isReactive) {
        for (let i = 0; i < n; i++) {
            // ! 此处是为了兼容编译阶段不知道是否是reactive数据的情况
            const child = call(mockRef(list[i]), mockRef(i) as any);
            if (child) container.appendChild(child as any);
        }
        return container;
    }
    // const proxy = list[util].proxy;
    const ScopeEnd = Renderer.createEmptyMountNode();
    const EndMap: ITrueElement[] = [];
    const Cleaners: ICleaner[] = [];

    const cacheManager = createDomCacheManager();

    let head: ITrueElement;

    const ScopeItems: IProxyData<{item: any, index: number}>[] = [];

    list[util].scopeItems = ScopeItems;

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
            // @ts-ignore
            const children = child.childNodes;
            const n = children.length;
            if (n === 0) {
                end = Renderer.createEmptyMountNode();
                // @ts-ignore
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
    container.appendChild(ScopeEnd as any);
    watchArray(list, ({index, count, data, type}: IOprationAction) => {
        switch (type) {
            case OprateType.Push: {
                // console.warn('OprateType.Push', index, count, data, type);
                const doc = Renderer.createDocumentFragment();
                const length = list.length;
                for (let i = 0; i < data.length; i++) {
                    const child = createChild(data[i], length + i);
                    // @ts-ignore
                    doc.appendChild(child);
                }
                // 如果没有父元素则 append到初始的frag上 // todo check 这里的逻辑
                cacheManager.insertBefore(doc, ScopeEnd, container);
            };break;
            case OprateType.Replace: {
                // console.warn('OprateType.Replace', index, count, data, type);
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
                // debugger;

                // console.warn('Remove', index, count, data, type);
                if (count === 0) break;

                const removeFunc = () => {
                    const startPos = index - 1;
                    const endPos = startPos + count;
                    // @ts-ignore
                    const endDom = EndMap[endPos]?.nextSibling || ScopeEnd;
    
                    const startDom = ((startPos < 0) ? (head || ScopeEnd) : EndMap[startPos]) as Node;
                    while (startDom.nextSibling && startDom !== endDom && startDom.nextSibling !== endDom) {
                        const dom = startDom.nextSibling;
                        cacheManager.removeElement(dom);
                    }
                    if (startPos < 0) {
                        // @ts-ignore
                        if (startDom !== ScopeEnd) {
                            // @ts-ignore
                            head = startDom.nextSibling;
                            // @ts-ignore
                            cacheManager.removeElement(startDom);
                        } else {
                            head = ScopeEnd;
                        }
                    }
                    EndMap.splice(index, count);
                    ScopeItems.splice(index, count);
                    Cleaners.splice(index, count).forEach(cleaner => {
                        cleaner.clean();
                    });
                };
    
                // items.forEach(item => item[util].release());
                // console.warn('【watch array remove】', index, count, data);

                if (ScopeEnd.parentElement) {
                    removeFunc();
                } else {
                    cacheManager.addTask(removeFunc);
                }

            };break;
            case OprateType.Insert: {
                // if (!EndMap[index - 1]) debugger;
                // @ts-ignore
                const ends: any[] = [];
                const scopes: any[] = [];
                const cleaners: any[] = [];
                const doc = Renderer.createDocumentFragment();
                const originHead = head;
                data.forEach((item, i) => {
                    const child = createChild(item, index + i, scopes, ends, cleaners);
                    // @ts-ignore
                    doc.appendChild(child);
                });
                ScopeItems.splice(index, 0, ...scopes);
                EndMap.splice(index, 0, ...ends);
                Cleaners.splice(index, 0, ...cleaners);
                const insertFunc = () => {
                    // @ts-ignore
                    const mountNode = index === 0 ? (originHead || ScopeEnd) : EndMap[index - 1].nextSibling;
                    getParent(mountNode, container).insertBefore(doc, mountNode);
                };
                if (ScopeEnd.parentElement) {
                    insertFunc();
                } else {
                    cacheManager.addTask(insertFunc);
                }
                // console.warn('【watch array insert】', index, count, data);
            };break;
        }
        // console.log('type=', ['replace', 'remove', 'insert', 'push'][type], `index=${index}; count=${count}`, 'data=', data, fromAssign);
    });
    // EndMap.push(end);
    return container;
}

registArrayMap(map);

export function mockMap (
    list: any[],
    call: (scope: any, i?: number)=>IGeneralElement,
    jsx?: boolean,
    k?: string,
    ik?: string,
) {
    return map.call(list, call, jsx, k, ik);
}