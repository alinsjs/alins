/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-06 21:13:18
 * @Description: Coding something
 */

import {IFragment, IGeneralElement, Renderer} from '../element/renderer';
import {IElement} from '../element/renderer';
/*
dom 元素挂载的锚点
firstElement => anchor 之前为组件的所有dom
*/

function getFirstElement (element?: IGeneralElement) {
    if (!element) return null;
    // @ts-ignore
    return (Renderer.isFragment(element) ? (element.children[0]) : element);
}


export function createAnchor () {
    let end: IElement|null = null;
    let start: IElement|null = null;

    let frag: IFragment;

    const initFirstMount = (element?: IGeneralElement): IFragment => {
        end = Renderer.createEmptyMountNode();
        start = getFirstElement(element) || end;

        if (Renderer.isFragment(element)) {
            // @ts-ignore
            element.appendChild(end);
            return element as IFragment;
        }
        const d = Renderer.createDocumentFragment();
        // @ts-ignore
        if (element) d.appendChild(element);
        // @ts-ignore
        d.appendChild(end);
        return d;
    };

    return {
        // 往当前组件替换dom元素
        replaceContent (element?: IGeneralElement) {
            if (!end || !start) {
                frag = initFirstMount(element);
                return frag;
            }
            if (!element) return;
            const container = (end.parentElement || frag);
            if (container === element) return element;
            const cursor = start;
            if (cursor !== end) {
                while (cursor.nextSibling !== end) {
                    cursor.nextSibling.remove();
                }
                cursor.remove();
            }
            // @ts-ignore
            start = getFirstElement(element) || end;
            container.insertBefore(element, end);
            return element;
        }
    };
}

export type ICtxAnchor = ReturnType<typeof createAnchor>