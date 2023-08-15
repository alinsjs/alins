/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-15 09:29:01
 * @Description: Coding something
 */

// todo MutationObserver跨平台
export function initMutationObserver(el: any){

    if(el.__$m_observer) return;

    el.__$m_observer = new MutationObserver(entries => {
        entries.forEach(item => {
            if (item.type === 'childList') {
                const { addedNodes, removedNodes } = item;

                addedNodes.forEach(node => {
                    // @ts-ignore
                    node.__$mounted?.(node);
                });

                removedNodes.forEach(node => {
                    // @ts-ignore
                    node.__$removed?.(node);
                });
            }
        });
    });

    el.__$m_observer.observe(el, {
        'childList': true,
        'subtree': true
    });
}