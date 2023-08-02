import type {Identifier, IfStatement, Statement} from '@babel/types';
import {getT, Names, traverseIfStatement} from '../parse-utils';
import {ControlScope} from './control-scope';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-14 17:39:29
 * @Description: Coding something
 */


export class IfScope extends ControlScope<IfStatement> {

    _init () {
        const node = this.path.node;
        const map = traverseIfStatement(node);
        console.log('if-debug: map=', map);

        const t = getT();

        let anchor = null;

        const setAnchor = (
            object: any, id: Identifier, args: any[],
        ) => {
            anchor = t.callExpression(
                t.memberExpression(object, id),
                args
            );
            args[args.length - 1]._call = anchor;
        };

        setAnchor(t.identifier(Names.Ctx), map.if.id, [ map.if.test, map.if.fn ]);

        for (const item of map.elif) {
            setAnchor(anchor, item.id, [ item.test, item.fn ]);
        }

        if (map.else) {
            setAnchor(anchor, map.else.id, [ map.else.fn ]);
        }

        const end = map.end;

        setAnchor(anchor, end.id, [ end.fn ]);

        this.replaceEnd = (nodes: Statement[]) => {
            const block = t.blockStatement(nodes);
            // 只要end有返回，则肯定有返回
            // if (!this.returned) this.returned = isBlockReturned(block);
            if (this.parentScope.awaitRecorded) {
                end.fn.body._setAsync?.();
            }
            end.fn.body = block;
            this.replaceEnd = null;
        };

        if (!this.top) {
            anchor = t.returnStatement(anchor);
            // anchor = createVarDeclaration('var',
            //     [ createVarDeclarator(Names.TempResult, anchor) ]
            // );
        }
        // this.returned = map.returned;
        this.newNode = anchor;
    }
}