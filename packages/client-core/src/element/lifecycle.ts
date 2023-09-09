/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-15 09:29:01
 * @Description: Coding something
 */

export function initWebMountedObserver (parent: any) {

    if (typeof parent.__$count === 'undefined') parent.__$count = 1;
    else parent.__$count ++;
    if (parent.__$m_observer) return;

    parent.__$m_observer = new window.MutationObserver(entries => {
        entries.forEach(item => {
            if (item.type === 'childList') {
                item.addedNodes.forEach(node => {
                    if (node.nodeType !== 1 || !parent) return;
                    // @ts-ignore
                    if (node.__$mounted) {
                        // @ts-ignore
                        const fn = node.__$mounted(node);
                        // @ts-ignore
                        node.__$mounted = null;
                        if (typeof fn === 'function') {
                            // @ts-ignore
                            node.__$removed = fn;
                            initWebRemovedObserver(node);
                        }
                        parent.__$count --;
                        if (parent.__$count === 0) {
                            parent.__$m_observer.disconnect();
                            parent.__$m_observer = null;
                            parent = null;
                        }
                    };
                });
            }
        });
    });

    parent.__$m_observer.observe(parent, {
        'childList': true,
    });
}

let removeCount = 0;
let removeObserver: MutationObserver|null = null;

function onNodeRemove (node: any) {
    if (node.__$removed) {
        node.__$removed(node);
        node.__$removed = null;
        removeCount --;
        if (removeCount <= 0) {
            removeObserver!.disconnect();
            removeObserver = null;
        }
        return true;
    }
    return false;
}

export function initWebRemovedObserver (el: any) {

    el.setAttribute('__rm__', '');

    if (removeObserver) {
        removeCount ++;
        return;
    }

    removeCount = 1;

    removeObserver = new window.MutationObserver(entries => {
        entries.forEach(item => {
            if (item.type === 'childList') {
                item.removedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    onNodeRemove(node);
                    // @ts-ignore
                    const els = node.querySelectorAll('[__rm__]');
                    els.forEach(item => {
                        onNodeRemove(item);
                    });
                });
            }
        });
    });
    removeObserver!.observe(window.document.body, {
        'childList': true,
        'subtree': true,
    });
}


// export function appended (el: Node, call: ((el: Node)=>void)) {
//     (el as any).__$appended = call;
// }
// export function mounted (el: Node, call: ((el: Node)=>void)) {
//     (el as any).__$mounted = call;
// }
// export function removed (el: Node, call: ((el: Node)=>void)) {
//     (el as any).__$removed = call;
//     initRemovedObserver(el);
// }