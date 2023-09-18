/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-13 16:49:51
 * @Description: Coding something
 */
/*

1. // @reactive 标注import的内容为响应式数据
2. // @shallow 标注为浅响应式
3. // @static 标注数据不为响应式
*/

import type { Node, VariableDeclaration, VariableDeclarator } from '@babel/types';

function parseComment (node: Node, onlyHead = false) {
    const comments: string[] = [];
    const nodeLine = node.loc?.start.line || 0;
    const before = node.leadingComments?.[node.leadingComments.length - 1];
    const commentEls: any[] = [];
    if (before && before.loc?.start.line === nodeLine - 1) {
        comments.push(before.value);
        commentEls.push(before);
    }
    const after = node.trailingComments?.[0];

    if (!onlyHead && after && after.loc?.start.line === nodeLine) {
        commentEls.push(before);
        comments.push(after.value);
    }
    return { comment: comments.join('\n'), clear (reg: RegExp) {
        const replace = (node: any) => {
            if (node)node.value = node.value.replace(reg, (str: string) => str.replace('@', '$$'));
        };
        replace(before);
        if (!onlyHead) replace(after);
    } };
}

export const RegMap = {
    React: /@reactive(\((.*?)\))?/i,
    Static: /@static(\((.*?)\))?/i,
    Shallow: /@shallow/i,
    StaticScope: /@static\-scope/i,
};

export function parseCommentMulti (node: Node, reg = RegMap.React) {
    const { comment, clear } = parseComment(node);
    if (!comment) return '';

    if (reg === RegMap.Static && RegMap.StaticScope.test(comment)) return '';

    const result = comment.match(reg);
    if (!result) return '';
    clear(reg);
    if (!result[2]) return '*';
    return result[2].split(',').map(s => s.trim());
}

export function parseCommentSingle (node: Node, reg = RegMap.Shallow, onlyHead?: boolean) {
    const { comment, clear } = parseComment(node, onlyHead);
    if (!comment) return false;
    if (!reg.test(comment)) return false;
    clear(reg);
    return true;
}

export function parseVarDeclCommentReactive (node: VariableDeclaration) {
    const comment = parseCommentMulti(node);
    let isStatic = false;
    if (comment) {
        handleDeclarations(comment, node, node => {node._isComReact = true;});
    } else {
        // 不同同时被指定为 @reactive 和 @static
        const comment = parseCommentMulti(node, RegMap.Static);
        if (comment) {
            isStatic = true;
            handleDeclarations(comment, node, node => {node._isComStatic = true;});
        }
    }
    if (!isStatic) {
        const boolean = parseCommentSingle(node);
        if (boolean) {
            node.declarations.forEach(dec => {
                // if(dec.id.name)
                dec._isShallow = true;
            });
        }
    }
}

function handleDeclarations (comment: any, node: VariableDeclaration, handle: (node: VariableDeclarator)=>void) {
    node.declarations.forEach(dec => {
        if (dec.id.type === 'Identifier') {
            const name = dec.id.name;
            if (comment === '*' || comment.includes(name)) {
                handle(dec);
            }
        }
    });
}