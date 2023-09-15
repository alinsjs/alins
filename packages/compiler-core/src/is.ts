/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 16:43:11
 * @Description: Coding something
 */
import type { NodePath } from '@babel/traverse';
import type { BlockStatement, CallExpression, FunctionDeclaration, JSXElement, Node, VariableDeclarator } from '@babel/types';

// export function isFuncParameter (path: NodePath<Identifier>) {

// }

export function isJSXElement (node: Node) {
    return node.type === 'CallExpression' && isJsxCallee(node);
}

export function isJsxCallee (node: CallExpression) {
    const callee = node.callee;
    if (!callee) return false;
    // @ts-ignore
    return callee.object?.name === 'React' && callee.property?.name === 'createElement';
}

export function isSkippedNewNode (path: NodePath<Node>): boolean {
    if (typeof path.node.start !== 'number') {
        return true;
    }
    return false;
}

export function isObjectAssignDeclarator (node:VariableDeclarator) {
    if (node.init?.type !== 'CallExpression') return false;
    const callee = node.init.callee;
    // @ts-ignore
    return isMemberExp(callee) && callee.object?.name === 'Object' && callee.property?.name === 'assign';
}

export enum BlockReturnType {
    None = 0,
    Common = 1,
    Jsx = 2,
}

export function isBlockReturned (block: BlockStatement|any): BlockReturnType {
    if (block.type !== 'BlockStatement') {
        return (isOriginJSXElement(block.type)) ? BlockReturnType.Jsx : BlockReturnType.Common;
    }
    const list = block.body;
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].type === 'ReturnStatement') {
            // @ts-ignore
            return (isOriginJSXElement(list[i]?.argument?.type)) ? BlockReturnType.Jsx : BlockReturnType.Common;
        }
    }
    return 0;
}

export function isComponentFunc (node: FunctionDeclaration|VariableDeclarator) {
    let name = '';
    let block: BlockStatement|null = null;
    // @ts-ignore
    if (node.type === 'FunctionDeclaration') {
        // @ts-ignore
        name = node.id?.name;
        block = node.body;
    } else {
        if (isFuncExpression(node.init)) {
            // @ts-ignore
            name = node.id.name;
            // @ts-ignore
            block = (node as VariableDeclarator).init?.body;
        }
    }
    let isComp = false;
    if (name) {
        if (name.charCodeAt(0) <= 90) {
            isComp = true;
        } else if (block) {
            if (isBlockReturned(block) === BlockReturnType.Jsx) {
                isComp = true;
            }
        }
    }
    return isComp;
}

// export function isFuncReturnJsx () {

// }

export function isJSXComponent (path: NodePath<JSXElement>) {
    // @ts-ignore
    return path.node.openingElement.name.name.charCodeAt(0) <= 90;
}

export function isNeedComputed (node: VariableDeclarator) {
    if (!node.init) return false;
    const type = node.init.type;
    if (type === 'Identifier') return false;
    else if (isMemberExp(node.init)) {
        // @ts-ignore
        let o = node.init.object;
        while (isMemberExp(o)) {
            o = o.object;
        }
        if (o.type === 'Identifier') return false;
    }
    return true;
}

export function isJsxExtendDef (node: any) {
    if (
        node.type === 'FunctionDeclaration' &&
        node.id.name === '_extends' &&
        typeof node.start !== 'number'
    ) {
        return true;
    }
    return false;
}

export function isJsxExtendCall (path: NodePath<CallExpression>) {
    const callee = path.node.callee;
    if (
        callee.type === 'Identifier' &&
        callee.name === '_extends'
    ) {
        // @ts-ignore
        const pcallee = path.parent?.callee;
        if (
            pcallee &&
            pcallee.object?.name === '_$$' &&
            pcallee.property?.name === 'ce'
        ) {
            return true;
        }

    }
    return false;
}
export function isOriginJSXElement (type?: string) {
    return type === 'JSXElement' || type === 'JSXFragment';
}

const EventNameMap = {
    onclick: 1,
    onmousedown: 1,
    onmouseenter: 1,
    onmouseleave: 1,
    onmousemove: 1,
    onmouseover: 1,
    onmouseup: 1,
    ontouchend: 1,
    ontouchmove: 1,
    ontouchstart: 1,
    onwheel: 1,
    oninput: 1,
    onchange: 1,
    onfullscreenchange: 1,
    onfullscreenerror: 1,
    oncopy: 1,
    oncut: 1,
    onpaste: 1,
    onabort: 1,
    onauxclick: 1,
    onbeforeinput: 1,
    onblur: 1,
    oncanplay: 1,
    oncanplaythrough: 1,
    onclose: 1,
    oncompositionend: 1,
    oncompositionstart: 1,
    oncompositionupdate: 1,
    oncontextmenu: 1,
    oncuechange: 1,
    ondblclick: 1,
    ondrag: 1,
    ondragend: 1,
    ondragenter: 1,
    ondragleave: 1,
    ondragover: 1,
    ondragstart: 1,
    ondrop: 1,
    ondurationchange: 1,
    onemptied: 1,
    onended: 1,
    onerror: 1,
    onfocus: 1,
    onfocusin: 1,
    onfocusout: 1,
    onformdata: 1,
    ongotpointercapture: 1,
    oninvalid: 1,
    onkeydown: 1,
    onkeypress: 1,
    onkeyup: 1,
    onload: 1,
    onloadeddata: 1,
    onloadedmetadata: 1,
    onloadstart: 1,
    onlostpointercapture: 1,
    onmouseout: 1,
    onpause: 1,
    onplay: 1,
    onplaying: 1,
    onpointercancel: 1,
    onpointerdown: 1,
    onpointerenter: 1,
    onpointerleave: 1,
    onpointermove: 1,
    onpointerout: 1,
    onpointerover: 1,
    onpointerup: 1,
    onprogress: 1,
    onratechange: 1,
    onreset: 1,
    onresize: 1,
    onscroll: 1,
    onselect: 1,
    onselectionchange: 1,
    onselectstart: 1,
    onsubmit: 1,
    onsuspend: 1,
    ontimeupdate: 1,
    ontoggle: 1,
    ontouchcancel: 1,
};

export function isEventAttr (name: string) {
    return !!EventNameMap[name];
}

export function isFuncExpression (node: any) {
    return (node?.type === 'ArrowFunctionExpression' || node?.type === 'FunctionExpression');
}

const DecoMap = {
    'prevent': 1, 'stop': 1, 'capture': 1,
    'once': 1, 'self': 1, 'pure': 1,
};

export function isEventEmptyDeco (name: string, deco: string, value: any) {
    return isEventAttr(name) && DecoMap[deco] && !value;
}

export function isArrayMapCall (node: CallExpression) {
    // @ts-ignore
    return node.callee?.property?.name === 'map';
}

export function isBlockBreak (elements: any[]) {
    for (let i = elements.length - 1; i >= 0; i--) {
        const node = elements[i];
        if (node.type === 'BreakStatement') {
            // ! break 换成 return;
            node.type = 'ReturnStatement';
            return true;
        } else if (node.type === 'BlockStatement') {
            if (isBlockBreak(node.body)) {
                return true;
            }
        }
    }
    return false;
}

export function isMemberExp (node: Node) {
    return node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression';
}