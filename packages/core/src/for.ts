import {isProxy, watch} from 'packages/reactive/src';
import {IProxyData} from 'packages/utils/src';
import {IFragment, IGeneralElement, ITrueElement, Renderer, ITextNode} from './element/renderer';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */
export function _for () {
    
}

export function map (list: IProxyData<any[]>, call: (item: any, index: number)=>IGeneralElement) {
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
    const end = Renderer.createEmptyMountNode();
    const EndMap: ITrueElement[] = [];

    const createChild = (item: any, i: number) => {
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
    watch(list, (v, ov, path, i, remove) => {
        const index = parseInt(i);
        if (!remove) {
            // const [child, end] = createChild(v, index);

        } else {
            if (!EndMap[i]) {
                const [child, end] = createChild(v, index);
                EndMap[i] = end;
            }
        }
    }, false);
    // EndMap.push(end);
    container.appendChild(end as any);
    return container;
}