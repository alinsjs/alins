import type { ILifeListener, IElement } from './alins.d';
import { defineRenderer } from './renderer';

enum ElementType {
    Element,
    Text,
    Empty,
    Frag,
};

type IListener = (event: any) => any;
type IEventListener = (el: CustomElement, name: string, call: IListener) => void;

interface ICustomRender {
    render?(el: CustomElement): ((el: CustomElement)=>void)|void;
    onRenderEnd?(el: CustomElement): void;
    addEventListener?: IEventListener;
    removeEventListener?: IEventListener;
}

const CustomHacker: ICustomRender = {
    render (el: CustomElement) {
        const prefix = new Array(el.deep).fill('  ').join('');
        const text = `${el.innerText}`;
        console.log(`${prefix}text: ${text.trim()}`);
    },
};

function onElementMounted (node: CustomElement, parent: CustomElement) {
    const removed = node._onMounted?.(node);
    if (removed) node._onRemoved = removed;
    node.parentElement = parent;
}

export class CustomElement implements IElement {
    static Root: CustomElement|null = null;
    _onMounted?: ILifeListener<void|ILifeListener>;
    _onRemoved?: ILifeListener;
    type = ElementType.Element;
    style: Record<string, any> = {}; // mock
    tagName = '';
    innerText = '';
    _attributes: Record<string, any> = {};
    _listeners: Record<string, Set<IListener>> = {};
    get textContent () {return this.innerText;};
    set textContent (v) {this.innerText = v;}
    deep = 0;
    addEventListener (name: string, call: IListener) {
        if (!this._listeners[name]) this._listeners[name] = new Set();
        this._listeners[name].add(call);
        CustomHacker.addEventListener?.(this, name, call);
    };
    removeEventListener (name: string, call: IListener) {
        if (this._listeners[name]) {
            this._listeners[name].delete(call);
        }
        CustomHacker.removeEventListener?.(this, name, call);
    };
    setAttribute (key: string, value: any) {this._attributes[key] = value;};
    removeAttribute (key: string) {delete this._attributes[key];};
    getAttribute () {return '';};
    _classList: Set<string> = new Set();
    classList = {
        add: (name: string) => {this._classList.add(name);},
        remove: (name: string) => {this._classList.delete(name);}
    };
    get className () {
        return Array.from(this._classList).join(' ');
    };
    set className (name: string) {
        this._classList = new Set(name.split(' '));
    }
    constructor (type, text = '', tag = '') {
        this.type = type;
        this.tagName = tag;
        this.innerText = text;
    }
    parentElement: CustomElement|null = null;
    get parentNode () {return this.parentElement;};
    remove () {
        const children = this.parentElement?.children;
        if (children) {
            children.splice(children.indexOf(this), 1);
            this._onRemoved?.(this);
        }
    }
    get innerHTML () {return this.innerText;}
    get outerHTML () {return this.innerText;}
    children: CustomElement[] = [];
    get childNodes () {
        return this.children;
    }
    appendChild (child: CustomElement) {
        if (child.type === ElementType.Frag) {
            for (const item of child.childNodes)
                this.appendChild(item);
        } else {
            this.children.push(child);
            onElementMounted(child, this);
        }
    }
    get nextSibling () {
        return this.parentElement?.children[this.index + 1] || null;
    }
    insertBefore (node: CustomElement, child: CustomElement) {
        if (child.parentElement !== this) throw new Error('insertBefore error');
        if (child.type === ElementType.Frag) {
            for (const item of child.childNodes)
                this.insertBefore(item, child);
        } else {
            this.children.splice(child.index, 0, node);
            onElementMounted(node, this);
        }
        return node;
    }
    get index () {
        const parent = this.parentElement;
        return !parent ? -1 : parent.children.indexOf(this);
    }

    render () {
        let result = CustomHacker.render?.(this);
        this.children.forEach(item => {
            item.deep = this.deep + 1;
            item.render();
        });
        if (typeof result === 'function') result = result(this);
        CustomHacker.onRenderEnd?.(this);
        return result;
    }
    _findName (name: string) {
        if (this.tagName === name) return this;
        for (const item of this.children) {
            const result = item._findName(name);
            if (result) return result;
        }
        return null;
    }
}

export function useRenderer (customRender: ICustomRender = {}) {
    Object.assign(CustomHacker, customRender);
    defineRenderer({
        querySelector (selector) {
            return CustomElement.Root?._findName(selector);
        },
        createElement (tag = '') {
            return new CustomElement(ElementType.Element, '', tag);
        },
        createTextNode (text) {
            return new CustomElement(ElementType.Text, text);
        },
        createEmptyMountNode () {
            return new CustomElement(ElementType.Empty);
        },
        createFragment () {
            return new CustomElement(ElementType.Frag);
        },
        isFragment (node) {
            return node.type === ElementType.Frag;
        },
        isElement (node) {
            return node.type === ElementType.Element || node.type === ElementType.Text;
        },
        onMounted (parent: CustomElement, child: CustomElement, call: any) {
            child._onMounted = call;
        },
        onRemoved (parent: CustomElement, child: CustomElement, call: any) {
            child._onRemoved = call;
        }
    });
    const root = new CustomElement(ElementType.Element, '', 'root');
    CustomElement.Root = root;
    return root;
}