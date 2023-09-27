import type { Identifier, IfStatement, Statement } from '@babel/types';
import { getT, markMNR, traverseIfStatement } from '../parse-utils';
import { ControlScope } from './control-scope';
import { AlinsVar, ImportManager } from './import-manager';
import { createScopeStack } from './scope-stack';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-14 17:39:29
 * @Description: Coding something
 */


export class IfScope extends ControlScope<IfStatement> {

    static ScopeStack = createScopeStack<IfScope>();

    _init () {
        IfScope.ScopeStack.newNode(this);
        const node = this.path.node;
        const map = traverseIfStatement(node);
        debugger;
        const t = getT();

        let anchor = null;

        const end = map.end;

        const setAnchor = (
            object: any, id: Identifier|null, args: any[],
        ) => {
            const bodyFn = args[args.length - 1];
            if (!id || id.name !== 'end') {
                args[args.length - 1] = markMNR(bodyFn, () => {
                    this.markScopeReturnJsx();
                });
            } else {
                end._mnr = (fn: any) => {
                    args[args.length - 1] = markMNR(fn);
                };
            }
            // @ts-ignore
            anchor = t.callExpression(
                id ? t.memberExpression(object, id) : object,
                args
            );
            bodyFn._call = anchor;
        };

        setAnchor(ImportManager.use(AlinsVar.If), null, [ map.if.test, map.if.fn ]);

        for (const item of map.elif) {
            setAnchor(anchor, item.id, [ item.test, item.fn ]);
        }

        if (map.else) {
            setAnchor(anchor, map.else.id, [ map.else.fn ]);
        }

        setAnchor(anchor, end.id, [ end.fn ]);

        this.replaceEnd = (nodes: Statement[]) => {
            const block = t.blockStatement(nodes);
            // 只要end有返回，则肯定有返回
            if (this.parentScope.awaitRecorded) {
                end.fn.body._setAsync?.();
            }
            end.fn.body = block;
            // ! end 的 mnr 需要在结束的时候做
            end._mnr?.(end.fn);
            // @ts-ignore
            this.replaceEnd = null;
        };

        if (!this.top) {
            // @ts-ignore
            anchor = t.returnStatement(anchor);
        }
        this.newNode = anchor;
    }

    exit () {
        IfScope.ScopeStack.pop();
        return super.exit();
    }
}