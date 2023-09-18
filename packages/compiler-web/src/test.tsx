import { IElement, defineRenderer, ILifeListener } from 'alins';

const ElementType = {
    Element: 0,
    Text: 1,
    Empty: 2,
    Frag: 3,
};

defineRenderer({
    querySelector (selector) {return selector === '#Root' ? LogElement.Root : null;},
    createElement (tag = '') {
        return new LogElement(ElementType.Element, '', tag);
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
    isFragment (node) {
        return node.type === ElementType.Frag;
    },
    isElement (node) {
        return node.type === ElementType.Element || node.type === ElementType.Text;
    },
    onMounted (parent: LogElement, node: LogElement, mounted: ILifeListener<void|ILifeListener>) {
        node.mountCallList.push(mounted);
    },
    onRemoved (parent: LogElement, node: LogElement, removed: ILifeListener) {
        node.removeCallList.push(removed);
    },
});

class LogElement implements IElement {
    static Root: null|LogElement = null;
    type = ElementType.Element;
    style = {}; // mock
    tagName = '';
    className = '';
    innerText = '';
    get textContent () {return this.innerText;};
    set textContent (v) {this.innerText = v;}
    deep = 0;
    get prefix () {
        return new Array(this.deep).fill('--').join('');
    }
    addEventListener () {};
    removeEventListener () {};
    setAttribute () {};
    removeAttribute () {};
    getAttribute () {return '';};
    classList = {
        add () {},
        remove () {}
    };
    constructor (type, text = '', tag = '') {
        this.type = type;
        this.tagName = tag;
        this.innerText = text;
        if (tag === 'Root') LogElement.Root = this;
    }
    parentElement: LogElement|null = null;
    get parentNode () {return this.parentElement;};
    removeCallList: any[] = [];
    remove () {
        const children = this.parentElement?.children;
        if (children) {
            children.splice(children.indexOf(this), 1);
            this.removeCallList.forEach(call => call(this));
        }
    }
    get innerHTML () {return this.innerText;}
    get outerHTML () {return this.innerText;}
    children: LogElement[] = [];
    get childNodes () {
        return this.childNodes;
    }
    mountCallList: any[] = [];
    appendChild (child: LogElement) {
        this.children.push(child);
        child.mountCallList.forEach(call => call(child));
    }
    get nextSibling () {
        return this.parentElement?.children[this.index + 1] || null;
    }
    insertBefore (node, child) {
        if (child.parentElement !== this) {
            throw new Error('insertBefore error');
        }
        this.parentElement?.children.splice(child.index - 1, 0, node);
        child.mountCallList.forEach(call => call(child));
        return node;
    }
    get index () {
        const parent = this.parentElement;
        return !parent ? -1 : parent.children.indexOf(this);
    }
    render () {
        const text = `${this.innerText}`;
        if (this.type === ElementType.Text) {
            text && console.log(`${this.prefix}text: ${text.trim()}`);
        } else if (this.type === ElementType.Element) {
            console.log(`${this.prefix}${this.tagName}: ${text.trim()}`);
            this.children.forEach(item => {
                item.deep = this.deep + 1;
                item.render();
            });
        }
    }
}

const Root = new LogElement(ElementType.Element, '', 'Root');

let v = 0;
const v2 = v * 2;

<div $$Root>
    value = {v}
    <div>value * 2 = {v2}</div>
</div>;

function loopRender () {
    v ++;
    console.clear();
    Root.render();
    setTimeout(() => {requestAnimationFrame(loopRender);}, 1000);
}

loopRender();