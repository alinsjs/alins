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

import type {Node, VariableDeclaration, VariableDeclarator} from '@babel/types';

function parseComment (node: Node) {
    const comments: string[] = [];
    const nodeLine = node.loc?.start.line || 0;
    const before = node.leadingComments?.[node.leadingComments.length - 1];
    if (before && before.loc?.start.line === nodeLine - 1) {
        comments.push(before.value);
    }
    const after = node.trailingComments?.[0];

    if (after && after.loc?.start.line === nodeLine) {
        comments.push(after.value);
    }
    return comments.join('\n');
}

const RegMap = {
    React: /@reactive(\((.*?)\))?/i,
    Static: /@static(\((.*?)\))?/i,
    Shallow: /@shallow/i,
};

export function parseCommentMulti (node: Node, reg = RegMap.React) {
    const comment = parseComment(node);
    if (!comment) return '';

    const result = comment.match(reg);
    if (!result) return '';
    if (!result[2]) return '*';
    return result[2].split(',').map(s => s.trim());
}

export function parseCommentSingle (node: Node, reg = RegMap.Shallow) {
    const comment = parseComment(node);
    if (!comment) return false;
    return reg.test(comment);
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