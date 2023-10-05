/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-20 11:21:57
 * @Description: Coding something
 */
import { NodePath, Node } from '@babel/traverse';
import { parseCommentSingle, RegMap } from '../comment';
export class StaticScope {
    enable = false;
    check (path: NodePath<Node>) {
        if (this.enable) return;
        const node = path.node;

        const markStatic = () => {
            this.enable = true;
            // @ts-ignore
            node._isStaticScope = true;
        };

        // @ts-ignore
        if (node._isStaticScope) {
            markStatic();
            return;
        }

        const comment = parseCommentSingle(node, RegMap.StaticScope, true);
        if (comment) {
            markStatic();
            return;
        }
        // ! 去除变量命名控制静态作用域
        // if (node.type === 'FunctionDeclaration') {
        //     if (node.id?.name[0] === '_') markStatic();
        // } else if (
        //     node.type === 'ArrowFunctionExpression' ||
        //     node.type === 'FunctionExpression'
        // ) {
        //     if (
        //         path.parent.type === 'VariableDeclarator' &&
        //         // @ts-ignore
        //         path.parent.id?.name[0] === '_'
        //     ) {
        //         markStatic();
        //     }
        // }
    }
    exit (node: any) {
        if (this.enable && node._isStaticScope) {
            this.enable = false;
        }
    }

}