/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-09 23:34:59
 * @Description: Coding something
 */

const ElementType = {
    Element: 0,
    Text: 1,
    Empty: 2,
    Frag: 3,
};

window.Alins.defineRenderer({
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
});

class LogElement {
    static Root = null;
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
    parentElement = null;
    get parentNode () {return this.parentElement;};
    remove () {
        const children = this.parentElement?.children;
        if (children) {
            children.splice(children.indexOf(this), 1);
        }
    }
    get innerHTML () {return this.innerText;}
    children = [];
    get childNodes () {
        return this.childNodes;
    }
    appendChild (child) {
        this.children.push(child);
    }
    get nextSibling () {
        return this.parentElement?.children[this.index + 1] || null;
    }
    insertBefore (node, child) {
        if (child.parentElement !== this) {
            throw new Error('insertBefore error');
        }
        this.parentElement?.children.splice(child.index - 1, 0, node);
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
    setTimeout(loopRender, 1000);
}

loopRender();
