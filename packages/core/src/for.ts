/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import {createProxy, isProxy, watch, watchArray, wrapReactive} from 'packages/reactive/src';
import {IOprationAction, OprateType, registArrayMap} from 'packages/reactive/src/array-proxy';
import {IProxyData, IRefData, trig, util} from 'packages/utils/src';
import {IFragment, IGeneralElement, ITrueElement, Renderer, ITextNode, IElement} from './element/renderer';
import {getParent} from './utils';


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
    call: (scope: any, i?: number)=>IGeneralElement,
    jsx = false,
    k = '$I',
    ik = ''
) {
    const list = this;
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

    let head: ITrueElement;

    const scopeItems: IProxyData<{item: any, index: number}>[] = [];
    list[util].scopeItems = scopeItems;
    // @ts-ignore ! 此处用于在slice方法中获取 item
    scopeItems.key = k;
    // window.scope = scopeItems;
    // window.EndMap = EndMap;

    const createScope = (item: any, i: number): IProxyData<any> => {
        item = createProxy({v: item}, {shallow: true});
        const scope = {[k]: item};

        if (ik) { // 表示有第二个参数
            scope[ik] = createProxy({v: i}, {shallow: true});
        }
        return scope;
    };

    const createChild = (item: any, i: number): [ITrueElement, ITrueElement, IProxyData<any>] => {
        console.log('createChild', item, i);
        const scope = createScope(item, i);

        let child = call(scope[k], scope[ik] || i);
        // @ts-ignore
        let end: ITrueElement = child;
        if (!child) {
            child = Renderer.createEmptyMountNode();
            end = child;
            if(i === 0) head = child;
        } else if (Renderer.isFragment(child)) {
            child = child as IFragment;
            const n = child.children.length;
            if (n === 0) {
                end = Renderer.createEmptyMountNode();
                child.appendChild(end as any);
                if(i === 0) head = end;
            } else {
                end = child.children[n - 1] as any;
                if(i === 0) head = child.children[0];
            }
        }else{
            if(i === 0) head = child;
        }
        // if(i===0)debugger;
        console.log(head, i);
        return [child, end, scope];
    };
    for (let i = 0; i < n; i++) {
        const item = list[i];
        const [child, end, scope] = createChild(item, i);
        scopeItems[i] = scope;
        container.appendChild(child as any);
        EndMap[i] = end;
    }
    watchArray(list, ({index, count, data, type}: IOprationAction) => {
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
                // 如果没有父元素则 append到初始的frag上 // todo check 这里的逻辑
                getParent(ScopeEnd, container).insertBefore(doc, ScopeEnd);
            };break;
            case OprateType.Replace: {
                if (!scopeItems[index]) {
                    // console.warn('【debug: watch array replace1', index, JSON.stringify(data));
                    scopeItems[index] = createScope(data[0], index);
                } else {
                    console.warn('【debug: watch array replace2', index, JSON.stringify(data));
                    // const v = isProxy(data[0]) ? data[0].v : data[0];
                    if (data[0] !== scopeItems[index][k].v) {
                        // console.log('debug: watch array replace------------');
                        scopeItems[index][k].v = data[0];
                    }
                    scopeItems[index][ik].v = index;
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


                let startDom = ((startPos < 0) ? (head||ScopeEnd) :  EndMap[startPos]) as Node;

                while (startDom.nextSibling && startDom.nextSibling !== endDom) {
                    startDom.nextSibling.remove();
                }

                if(startPos < 0){
                    if(startDom !== ScopeEnd){
                        head = startDom.nextSibling;
                        startDom.remove();
                    }else{
                        head = ScopeEnd;
                    }
                }

                EndMap.splice(index, count);
                scopeItems.splice(index, count);
                // items.forEach(item => item[util].release());
                // console.warn('【watch array remove】', index, count, data);
            };break;
            case OprateType.Insert: {
                debugger;
                // if (!EndMap[index - 1]) debugger;
                const mountNode = index === 0 ? (head||ScopeEnd) : EndMap[index - 1].nextSibling;
                const ends: any[] = [];
                const scopes: any[] = [];
                data.forEach((item, i) => {
                    const [child, end, scope] = createChild(item, index + i);
                    getParent(mountNode, container).insertBefore(child, mountNode);
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
