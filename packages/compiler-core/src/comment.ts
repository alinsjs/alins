/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-13 16:49:51
 * @Description: Coding something
 */
/*

1. // @reactive 标注import的内容为响应式数据
2. // @shallow 标注为浅响应式
*/

import type {Node} from '@babel/types';

// import {a} from '/aa'; // @reactive[a,b]
// const a = 1;
// const b = a + 1; set:() => {

// };

function parseComment (node: Node) {
    const before = node.leadingComments?.[node.leadingComments.length - 1];
    if (before) return before;
    const after = node.trailingComments?.[0];

    if (after && after.loc && after.loc.start.line === node.loc?.start.line) {
        return after;
    }
    return null;
}

export function parseCommentReactive (node: Node) {
    const comment = parseComment(node);
    if (!comment) return '';

    const result = comment.value.match(/@reactive(\((.*?)\))?/i);
    if (!result) return '';
    if (!result[2]) return '*';
    return result[2].split(',').map(s => s.trim());
}

export function parseCommentShallow (node: Node) {
    const comment = parseComment(node);
    if (!comment) return false;
    return /@shallow/i.test(comment.value);
}