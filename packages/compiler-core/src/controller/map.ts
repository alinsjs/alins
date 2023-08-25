/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-18 00:47:31
 * @Description: Coding something
 */
// map 方法中有返回值为jsx时 对map进行转译

import type {CallExpression} from '@babel/types';
import type {Module} from '../context';
import {isOriginJSXElement} from '../is';
import {createCtxCall, getT, parseFirstMemberObject} from '../parse-utils';
import {ControlScope} from './control-scope';

export class MapScope extends ControlScope<CallExpression> {

    recordAwait = false; // ! 关闭后续的await收集

    module: Module;

    // ! 此处三个值在 _init 中赋值，在此处赋值会将init赋值覆盖
    keyName: string;
    indexKeyName: string;

    skip = false;

    // 箭头函数直接返回jsx
    isArrowFnReturnJsx: boolean;

    dataName: string;

    markReturnJsx () {
        if (this.isReturnJsx || this.skip) return;
        const scope = this.module.curScope; // 缓存当前的scope
        // this.parentScope.collectDependAction(this.dataName, () => {
        //     scope.markMapVariable(this.keyName, this.indexKeyName);
        // });
        // ! 此处是为了兼容编译阶段不知道是否是reactive数据的情况
        scope.markMapVariable(this.keyName, this.indexKeyName);
        // @ts-ignore
        if (this.path.parent._jsxExp) this.path.parent._jsxExp.skip = true;
        this.isReturnJsx = true;
    }

    onExit () {
        if (this.isReturnJsx) {
            const node = this.path.node;
            // @ts-ignore
            node._isMap = true;
            // this.parentScope.collectDependAction(this.dataName, () => {
            //     const t = getT();
            //     this.path.node.arguments.push(
            //         t.booleanLiteral(true),
            //         t.stringLiteral(this.keyName),
            //         t.stringLiteral(this.indexKeyName),
            //     );
            // });
            // ! 此处是为了兼容编译阶段不知道是否是reactive数据的情况
            const t = getT();
            // this.path.node.arguments.push(
            //     t.booleanLiteral(true),
            //     t.stringLiteral(this.keyName),
            //     t.stringLiteral(this.indexKeyName),
            // );
            this.path.replaceWith(
                createCtxCall('mm', [
                    // @ts-ignore
                    node.callee.object,
                    ...this.path.node.arguments,
                    t.booleanLiteral(true),
                    t.stringLiteral(this.keyName),
                    t.stringLiteral(this.indexKeyName),
                ])
            );
        }
    }

    _init () {
        // @ts-ignore
        this._replaceQueue = [];
        const node = this.path.node;

        // @ts-ignore
        const object = node.callee?.object;

        if (object) {
            if (object.type === 'Identifier') {
                this.dataName = object.name || '';
            } else if (object.type === 'MemberExpression') {
                this.dataName = parseFirstMemberObject(object).name || '';
            }
        }

        if (!this.dataName) {
            throw new Error('Map parse data error');
        }

        // this.dataName = node.callee?.object.name || '';
        const arg = node.arguments[0];
        // console.log('map node', node);
        // @ts-ignore
        arg._mapScope = this;

        // @ts-ignore
        const params = arg.params;

        if (params.length === 0) { // map 函数没有参数
            this.skip = true;
            return;
        }

        this.keyName = params[0].name;
        this.indexKeyName = params[1]?.name || '';
        if (
            arg.type === 'ArrowFunctionExpression' && isOriginJSXElement(arg.body.type)
        ) {
            // debugger;
            this.isArrowFnReturnJsx = true;
        }

    }
}