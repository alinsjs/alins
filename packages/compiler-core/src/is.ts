/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 16:43:11
 * @Description: Coding something
 */
import type {NodePath} from '@babel/traverse';
import type {BlockStatement, CallExpression, JSXElement, Node, VariableDeclarator} from '@babel/types';

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
    return callee.type === 'MemberExpression' && callee.object?.name === 'Object' && callee.property?.name === 'assign';
}

export function isBlockReturned (block: BlockStatement) {
    const list = block.body;
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].type === 'ReturnStatement') {
            return true;
        }
    }
    return false;
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
    else if (type === 'MemberExpression') {
        let o = node.init.object;
        while (o.type === 'MemberExpression') {
            o = o.object;
        }
        if (o.type === 'Identifier') return false;
    }
    return true;
}