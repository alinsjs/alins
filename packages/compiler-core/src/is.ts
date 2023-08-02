/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 16:43:11
 * @Description: Coding something
 */
import type {NodePath} from '@babel/traverse';
import type {BlockStatement, CallExpression, Identifier, JSXElement, Node, VariableDeclarator} from '@babel/types';

export function isFuncParameter (path: NodePath<Identifier>) {

}
 
export function isJsxCallee (path: NodePath<CallExpression>) {
    const node = path.node.callee;
    if (!node) return false;
    return node.object?.name === 'React' && node.property?.name === 'createElement';
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

export function isFuncReturnJsx () {

}

export function isJSXComponent (path: NodePath<JSXElement>) {
    return path.node.openingElement.name.name.charCodeAt(0) <= 90;
}
