/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-09 23:34:59
 * @Description: Coding something
 */

import { IRenderer, IElement } from 'packages/client-core/src';

enum ElementType {
    Element,
    Text,
    Empty,
    Frag,
}
class LogElement implements IElement<LogElement> {
    type: ElementType;
    style = {}; // mock
    tagName = '';
    className = '';
    addEventListener () {};
    removeEventListener () {};
    setAttribute () {};
    removeAttribute () {};
    getAttribute () {return '';};
    classList = {
        add () {},
        remove () {}
    };
    constructor (type: ElementType, text = '') {
        this.type = type;
        this.innerText = text;
    }
    parentElement: LogElement|null = null;
    get parentNode () {return this.parentElement;};
    remove () {
        const children = this.parentElement?.children;
        if (children) {
            children.splice(children.indexOf(this), 1);
        }
    }
    innerText = '';
    get innerHTML () {return this.innerText;}
    children: LogElement[] = [];
    get childNodes () {
        return this.childNodes;
    }
    appendChild (child: LogElement): void {
        this.children.push(child);
    }
    get nextSibling (): LogElement | null {
        return this.parentElement?.children[this.index + 1] || null;
    }
    insertBefore (node: LogElement, child: LogElement) {
        if (child.parentElement !== this) {
            throw new Error('insertBefore error');
        }
        this.parentElement?.children.splice(
            child.index - 1, 0, node,
        );
        return node;
    }
    get index (): number {
        const parent = this.parentElement;
        return !parent ? -1 : parent.children.indexOf(this);
    }

    render () {
        console.log(`${this.tagName}: ${this.innerText}`);
        this.children.forEach(item => item.render());
    }
}

// @ts-ignore
window.Alins.defineRenderer({
    querySelector () {},
    createElement (tag = '') {
        const node = new LogElement(ElementType.Element);
        node.tagName = tag;
        return node;
    },
    createTextNode (text) {
        return new LogElement(ElementType.Text, text);
    },
    createEmptyMountNode () {
        return new LogElement(ElementType.Empty);
    },
    createFragment () {
        return new LogElement(ElementType.Frag);
    },
    isFragment (node: LogElement) {
        return node.type === ElementType.Frag;
    },
    isElement (node: LogElement) {
        return node.type === ElementType.Element || node.type === ElementType.Text;
    },
} as IRenderer);

const Root = new LogElement(ElementType.Element);

function loopRender () {
    console.clear();
    Root.render();
    requestAnimationFrame(loopRender);
}

loopRender();

// @ts-ignore
Root.appendChild(<div>
    111
    <div>222</div>
</div>);