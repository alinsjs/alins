/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-14 17:39:29
 * @Description: Coding something
 */
import type {Statement, SwitchStatement} from '@babel/types';
import {getT, traverseSwitchStatement} from '../parse-utils';

import {ControlScope} from './control-scope';
import {createScopeStack} from './scope-stack';

export class SwitchScope extends ControlScope<SwitchStatement> {

    static ScopeStack = createScopeStack<SwitchScope>();

    _init () {
        SwitchScope.ScopeStack.newNode(this);
        const {endFunc, node, isReturnJsx} = traverseSwitchStatement(this.path.node);
        if (isReturnJsx) {
            this.markScopeReturnJsx();
        }

        this.newNode = node;

        if (!this.top) {
            this.newNode = getT().returnStatement(this.newNode);
        }
        this.replaceEnd = (nodes: Statement[]) => {
            // 只要end有返回，则肯定有返回
            if (this.parentScope.awaitRecorded) {
                // @ts-ignore
                endFunc.body._setAsync?.();
            }
            endFunc.body = getT().blockStatement(nodes);
            // @ts-ignore
            this.replaceEnd = null;
        };
    }

    exit () {
        SwitchScope.ScopeStack.pop();
        return super.exit();
    }
}