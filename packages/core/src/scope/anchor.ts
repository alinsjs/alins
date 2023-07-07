/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-06 21:13:18
 * @Description: Coding something
 */

import {IFragment, IGeneralElement, ITrueElement, Renderer} from '../element/renderer';
import {IElement} from '../element/renderer';
import {IBranchTarget} from './branch';
import {ICallCache} from './cache';
/*
dom 元素挂载的锚点
firstElement => anchor 之前为组件的所有dom
*/

function getFirstElement (element?: IGeneralElement) {
    if (!element) return null;
    // @ts-ignore
    return (Renderer.isFragment(element) ? (element.children[0]) : element);
}

let id = 0;
export function createAnchor (cache: ICallCache) {
    let end: IElement|null = null;
    let start: IElement|null = null;

    let frag: IFragment;

    const initFirstMount = (element?: IGeneralElement): IFragment => {
        end = Renderer.createEmptyMountNode(id++);
        start = getFirstElement(element) || end;
        console.warn('initFirstMount', start);

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

    // setInterval(() => {
    //     console.log(start);
    // }, 3000);

    return {
        start () {return start;},
        setStart (element: ITrueElement|null|undefined) {
            if (element) {
                // debugger;
                start = getFirstElement(element) || end;
            }
        },
        replaceBranch (branch: IBranchTarget) {
            console.log(start);
            // branch.parent
            const current = branch.current(); // ! 缓存一下当前branch， call之后会被覆盖
            const dom = cache.call(branch);
            // if (!window.bs) window.bs = {};
            // for (const k in window.bs) {
            //     console.log(k, window.bs[k].anchor.start());
            // }
            if (!branch.inited || (dom && branch.isVisible(current))) {
                branch.inited = true;
                // debugger;
                this.replaceContent(dom, branch);
            }
            return dom;
            // console.log(dom, branch, current);
            // if (branch.parent === current?.parent) {
            //     debugger;
            //     branch.parent?.anchor.setStart(dom);
            // }
        },
        // 往当前组件替换dom元素
        replaceContent (element?: IGeneralElement, branch?: IBranchTarget) {
            if (!end || !start) {
                frag = initFirstMount(element);
                return frag;
            }
            if (!element) return;
            console.log(element.textContent, element.outerHTML, end.parentElement);
            // debugger;
            const container = (end.parentElement || frag);
            if (container === element) return element;
            // if (!start.parentElement) {
            //     start = end; // ! start 不在页面上了 则 指向end
            // } else {
            const cursor = start;
            // debugger;
            if (cursor !== end) {
                while (cursor.nextSibling !== end) {
                    try {
                        cursor.nextSibling.remove();
                    } catch (e) {
                        // debugger;
                        console.error(e);
                        break;
                        // throw new Error(e);
                    }
                }
                cursor.remove();
            }
            // }
            // @ts-ignore
            const newEle = getFirstElement(element);
            const newStart = newEle || end;
            let parent = branch?.parent;
            while (parent && parent.anchor.start() === start) {
                parent.anchor.setStart(newStart);
                if (parent.call) cache.modifyCache(parent.call, newEle);
                parent = parent.parent;
            }
            start = newStart;
            container.insertBefore(element, end);
            console.log('xxxxxxx', this.start(), start, start?.parentElement);
            // debugger;
            return element;
        }
    };
}

export type ICtxAnchor = ReturnType<typeof createAnchor>