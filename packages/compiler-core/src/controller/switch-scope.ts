/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-14 17:39:29
 * @Description: Coding something
 */
import type {Statement, SwitchStatement} from '@babel/types';
import {getT, traverseSwitchStatement} from '../parse-utils';

import {ControlScope} from './control-scope';

export class SwitchScope extends ControlScope<SwitchStatement> {

    _init () {
        const {endFunc, node} = traverseSwitchStatement(this.path.node);

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
}