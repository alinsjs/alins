
/*
 * @Author: tackchen
 * @Date: 2022-10-26 08:54:24
 * @Description: Coding something
 */

export const DataAlinsDom = 'data-alins-dom';

export const getAlinsDomId = (() => {
    let MediaId = 0;

    return (dom: HTMLElement) => {
        const id = dom.getAttribute(DataAlinsDom);
        if (id) return id;
        return (++MediaId) + '';
    };
})();

export function createCssPool () {
    const setStyle = insertStyle(document.head);
    const css: string[] = [];

    return {
        update (index = css.length) {
            return (newValue: string) => {
                css[index] = newValue;
                setStyle(css.join());
            };
        },
        add (v: string) {
            const index = css.length;
            css.push(v);
            setStyle(css.join());
            return this.update(index);
        },
    };
};

export const DefaultCssPool = createCssPool();

// ! 调试时关闭CSSStyleSheet
const supporteAdoptedStyle = false; // typeof window.document.adoptedStyleSheets !== 'undefined' && !!window.CSSStyleSheet;

export function insertStyle (parent?: HTMLElement | null) {
    if (parent) {
        return insertHTMLStyle(parent);
    } else if (supporteAdoptedStyle) {
        const style = new CSSStyleSheet();
        document.adoptedStyleSheets.push(style);
        return (v: string) => {style.replace(v);};
    } else {
        return insertHTMLStyle(document.head);
    }
}

function insertHTMLStyle (parent: HTMLElement) {
    const style = document.createElement('style');
    parent.appendChild(style);
    return (v: string) => {style.textContent = v;};
}
