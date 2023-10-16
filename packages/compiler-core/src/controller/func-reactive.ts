/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-16 00:23:16
 * @Description: Coding something
 *
 *
let a = 0;
a ++;
const fn = () => a + 1;
const dom = <div a={fn()}></div>;
 *
 */
import type { Node, NodePath } from '@babel/traverse';
import type { Scope, IScopeVariable } from '../scope';

export class FuncReactiveScope {

    returnJsx = false;
    scope: Scope;

    isReactive = false;

    path: NodePath;

    variable: IScopeVariable;

    constructor (scope: Scope, path: NodePath<Node>) {
        this.scope = scope;
        // @ts-ignore
        this.variable = path.node._variable;
        try {
            this.variable._func_scope = this;
        } catch (e) {
            // debugger;
            console.warn('FuncReactiveScope', e);
        }
        // console.log(path.toString());
    }
    markReturnJsx () {
        this.returnJsx = true;
    }

    collectIdentifier (variable: IScopeVariable) {
        if (this.isReactive) return;
        if (variable.isReactive) {
            this.isReactive = true;
            this.variable.isReactive = true;
        } else {
            if (!variable.dependActions) variable.dependActions = [];
            variable.dependActions.push(() => {
                this.isReactive = true;
                this.variable.isReactive = true;
                this.scope._updateDependIdentifier(this.variable, false);
            });
        }
    }
}