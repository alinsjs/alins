/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-29 15:18:14
 * @Description: Coding something
 */
import type {NodePath} from '@babel/traverse';
import type {
    BlockStatement,
    CallExpression,
    Expression,
    Identifier,
    IfStatement,
    JSXExpressionContainer,
    MemberExpression,
    SwitchStatement,
    VariableDeclaration,
    VariableDeclarator,
    Node
} from '@babel/types';
import type {IBabelType} from './types';
import {isBlockReturned} from './is';

let currentCtx: any = null;

export const Names = {
    _Ctx: '_$',
    AliasPrefix: '_$',
    CtxFn: '_$$',
    ReactFn: 'r',
    ComputedFn: 'c',
    ComputedFullFn: 'cc',
    WatchFn: 'w',
    CreateElementFn: 'ce',
    Value: 'v',
    TempResult: '_$R',
    get Ctx () {
        // 部分使用ctx时候并不是在当前作用域
        // 比如因为有赋值导致的react和computed
        const ctx = currentCtx;
        // console.log('AlinsCtx use', ctx);
        // if (!ctx) debugger;
        if (!ctx._used) ctx._used = true;
        return this._Ctx;
    },
};


export let t: IBabelType;

export function getT () {
    return t;
}

export function initTypes (types: IBabelType) {
    t = types;
}

/**
 * {} = react({})
 * [] = react([])
 *
 * staticNode = react({value: staticNode})
 * aa() = react({value: aa()})
 * a.b = react({value: a.a})
 * a[0] = react({value: a[0]})
 * (() => {})() = react({value: (() => {})()})
 * (function () {})(); = react({value: (function () {})()})
 * ts:
 *
 */
// newNode
// function nn (node: any) {
//     node._new = true;
//     return node;
// }

export function createTest () {
    return t.variableDeclaration(
        'var',
        [ createVarDeclarator('x', t.numericLiteral(1)) ]
    );
}
export function createVarDeclaration (kind: VariableDeclaration['kind'], ds: any[]) {
    return t.variableDeclaration(
        kind,
        ds
    );
}

export function createVarDeclarator (id: string, init: any) {
    return  t.variableDeclarator(
        t.identifier(id),
        init,
    );
}
let id = 0;
export function createAlinsCtx () {
    // console.log('AlinsCtx 111', top);
    currentCtx = t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                t.identifier(Names._Ctx),
                t.callExpression(
                    t.identifier(Names.CtxFn),
                    []
                ),
            )
        ]
    );
    currentCtx._isCtx = true;
    currentCtx.id = id++;
    currentCtx._skip = false;
    return currentCtx;
}

export function createMemberExp (id: string, prop: string) {
    return t.memberExpression(
        t.identifier(id),
        t.identifier(prop)
    );
}

export function createElementMember () {
    return createMemberExp(Names.CtxFn, Names.CreateElementFn);
}

export function replaceJsxDomCreator (path: NodePath<CallExpression>) {
    return t.callExpression(
        createMemberExp(Names.CtxFn, Names.CreateElementFn),
        path.node.arguments,
    );
}

// ! 暂时先全部用v包裹 后续优化
export function createReadValue (idName: string) {
    const node = createMemberExp(idName, Names.Value);
    // @ts-ignore
    node._skip = true;
    return node;
}

export function createFullComputed (get: any, set: any) {
    return t.objectExpression([
        t.objectProperty(t.identifier('get'), get),
        t.objectProperty(t.identifier('set'), set),
    ]);
}

export function createComputed (node: VariableDeclarator) {
    const get = t.arrowFunctionExpression([], node.init as any);
    let target: any; ;
    // @ts-ignore
    if (node._computedSet) {
        // @ts-ignore
        target = createFullComputed(get, node._computedSet.expression);
    } else {
        target = get;
    }
    return skipNode(t.variableDeclarator(
        node.id,
        createComputeCall(target),
    ));
}

function createComputeCall (fn?: any) {
    return t.callExpression(
        createMemberExp(Names.CtxFn, Names.ComputedFn),
        // t.identifier('computed'),
        [ fn ]
    );
}

export function createJsxCompute (node: Expression|JSXExpressionContainer, isComp = false) {
    // debugger;
    // return t.jsxExpressionContainer(
    //     t.arrowFunctionExpression(
    //         [],
    //         node.expression as any
    //     )
    // );
    const isContainer = node.type === 'JSXExpressionContainer';
    const exp = isContainer ? node.expression as any : node as any;
    const call = t.arrowFunctionExpression(
        [], exp
    );

    const computed = isComp ? createComputeCall(call) : call;
    const result = isContainer ? t.jsxExpressionContainer(computed) : computed;
    // @ts-ignore
    result._handled = true;
    // @ts-ignore
    exp._handled = true;

    return result;
}

export function skipNode<T> (node: T): T {
    // @ts-ignore
    node._skip = true;
    return node;
}

export function createReact (node: VariableDeclarator) {
    // return callExpression(
    //     identifier('react'),
    //     [ identifier(idName) ]
    // );
    // debugger;
    // console.log('wrap react-------', node.id.name);
    const args: any[] = [
        t.objectExpression(
            [ t.objectProperty(
                t.identifier(Names.Value),
                node.init as any
            ) ]
        )
    ];
    if (node._isShallow) {
        args.push(t.booleanLiteral(true));
    }
    return skipNode(t.variableDeclarator(
        node.id,
        t.callExpression(
            createMemberExp(Names.CtxFn, Names.ReactFn),
            args
        ),
    ));
}

export function replaceWith<T extends Node> (path: NodePath<T>, newNode: any, markNew = true) {
    // @ts-ignore
    if (markNew)newNode._new = true;
    path.replaceWith(newNode);
}

export function isStaticNode (node: Node): boolean {
    // node = unwrapTSNode(node);
    if (!node) return true;
    switch (node.type) {
        case 'UnaryExpression': // void 0, !true
            return isStaticNode(node.argument);

        case 'LogicalExpression': // 1 > 2
        case 'BinaryExpression': // 1 + 2
            return isStaticNode(node.left) && isStaticNode(node.right);

        case 'ConditionalExpression': {
        // 1 ? 2 : 3
            return (
                isStaticNode(node.test) &&
                isStaticNode(node.consequent) &&
                isStaticNode(node.alternate)
            );
        }

        case 'SequenceExpression': // (1, 2)
        case 'TemplateLiteral': // `foo${1}`
            return node.expressions.every(expr => isStaticNode(expr));

        case 'ParenthesizedExpression': // (1)
            return isStaticNode(node.expression);

        case 'StringLiteral':
        case 'NumericLiteral':
        case 'BooleanLiteral':
        case 'NullLiteral':
        case 'BigIntLiteral':
            return true;
    }
    return false;
}

// a.a.a.a => a
export function parseFirstMemberObject (m: MemberExpression|Identifier, second?: (n2: Node, n1: Node)=>void) {
    let node = m;
    let last: any = null;
    // debugger;
    while (node.type === 'MemberExpression') {
        if (second) {
            last = node;
        }
        // @ts-ignore
        node = node.object;
    }
    second?.(last, node);
    return node as Identifier;
}

// // a.a.a.a = 2 => a;
// export function parseAssignVariable (path: NodePath<AssignmentExpression>) {
//     const node = path.node.left;
//     return parseFirstMemberObject(node).name;
// }

export function createUnfInit () {
    return t.unaryExpression(
        'void',
        t.numericLiteral(0)
    );
}

export function createExportAliasInit (alias: string, name: string) {
    // _$.w(()=> x.v, (v)=>x=v, false).v;
    const v = Names.Value;
    return t.memberExpression(
        t.callExpression(
            createMemberExp(Names.CtxFn, Names.WatchFn),
            [
                t.arrowFunctionExpression([], createMemberExp(alias, v)),
                t.arrowFunctionExpression([], t.assignmentExpression('=', t.identifier(name), t.identifier(v))),
                t.booleanLiteral(false),
            ]
        ),
        t.identifier(v),
    );
}

// export function replaceIfStatement () {
//     return t.callExpression(
//         createMemberExp(Names.Ctx, 'if'),
//         [
//             t.arrowFunctionExpression([], createMemberExp(alias, v)),
//             t.arrowFunctionExpression([], t.assignmentExpression('=', t.identifier(name), t.identifier(v))),
//             t.booleanLiteral(false),
//         ]
//     );
// }

function transformToBlock (body: any) {
    // 对于没有{}的语句 进行block包裹
    if (body.type !== 'BlockStatement') {
        body = t.blockStatement([ body ]);
    }
    // body._noBreak = true;
    return body;
}

export function traverseIfStatement (node: IfStatement, map: any = {elif: []}, i = 0) {
    // @ts-ignore
    node._traversed = true;

    if (node.alternate) {
        if (node.alternate?.type === 'IfStatement') {
            traverseIfStatement(node.alternate, map, i + 1);
        } else {
            let elseBody = node.alternate;
            if (elseBody.type !== 'BlockStatement') {
                elseBody = t.blockStatement([ node.alternate ]);
            }
            map.else = {
                id: t.identifier('else'),
                fn: createSetAsyncArrowFunc(elseBody),
            };
            // if (returned) returned = isBlockReturned(elseBody);
        }
    } else {
        //
    }

    const body = transformToBlock(node.consequent);
    const item = {
        id: t.identifier('elif'),
        test: t.arrowFunctionExpression([], node.test),
        fn: createSetAsyncArrowFunc(body),
    };
    // ! 只要为false 则不需要再检查其他分支
    // if (returned) returned = isBlockReturned(body);
    if (i === 0) {
        item.id.name = 'if';
        map.if = item;
        // map.returned = returned;
        map.end = {
            id: t.identifier('end'),
            fn: createSetAsyncArrowFunc(t.blockStatement([])),
        };

        return map;
    } else {
        map.elif.unshift(item);
    }
}

export function createSetAsyncArrowFunc (body: BlockStatement) {
    const node = t.arrowFunctionExpression([], body);
    // @ts-ignore
    body._setAsync = () => {
        node.async = true;
        // @ts-ignore
        const args = node._call.arguments;
        args[args.length - 1] = markMNR(args[args.length - 1]);
        // @ts-ignore
        node._call = null;
        // @ts-ignore
        body._setAsync = null;
    };
    return node;
}

export function traverseSwitchStatement (node: SwitchStatement) {
    const discr = t.arrowFunctionExpression([], node.discriminant);

    const cases = t.arrayExpression(node.cases.map(item => {
        const {test, consequent: cons} = item;
        let body = cons.length === 1 ? cons[0] : t.blockStatement(cons);
        body = transformToBlock(body);
        let result = t.objectExpression([
            // @ts-ignore
            t.objectProperty(t.identifier('c'), t.arrowFunctionExpression([], body)),
        ]);
        if (test !== null) { // ! default 分支处理
            // @ts-ignore
            result.properties.push(t.objectProperty(t.identifier('v'), test));
        }
        // @ts-ignore
        item._setBrk = () => {
            result.properties.push(
                t.objectProperty(t.identifier('b'), t.booleanLiteral(true)),
            );
            // @ts-ignore
            item._setBrk = null;
            // @ts-ignore
            result = null;
        };
        return result;
    }));

    const endFunc = createSetAsyncArrowFunc(t.blockStatement([]));
    return {
        endFunc,
        node: t.callExpression(
            t.memberExpression(t.callExpression(
                createMemberExp(Names.Ctx, 'switch'),
                [ discr, cases ]
            ), t.identifier('end')),
            [ endFunc ]
        )
    };

}

export const ModArrayFunc: Record<string, 1> = {
    splice: 1, push: 1, pop: 1, unshift: 1, shift: 1, sort: 1, fill: 1, reverse: 1
};

export function createEmptyString () {
    return t.stringLiteral('');
}
// async function fn() {
//     switch(data.a) {
//       case 0: console.log(1);break;
//       case 1: {console.log(1);break;}
//       case 1: {console.log(1);}break;
//       case 2: return <div>c1</div>;
//       case 3: list.push(2);
//       case 4: return <div>c3</div>;
//     }
//     return <div>end</div>;
//   }

export function markMNR (fn: any) {
    if (fn._mnrMarked) return fn;

    if (!isBlockReturned(fn.body)) {
        fn._mnrMarked = true;
        // ! 标注是否有返回值
        return t.callExpression(
            createMemberExp(Names.CtxFn, 'mnr'),
            [ fn ]
        );
    }
    return fn;
}

export function createImportAlins (useImport = true) {
    return useImport ?
        t.importDeclaration([
            t.importSpecifier(t.identifier('_$$'), t.identifier('_$$'))
        ], t.stringLiteral('alins')) :
        t.variableDeclaration('var', [
            t.variableDeclarator(t.identifier('_$$'), t.memberExpression(
                t.memberExpression(t.identifier('window'), t.identifier('Alins')),
                t.identifier('_$$'),
            ))
        ]);
}

export function parseComputedSet (path: NodePath<VariableDeclaration>) {
    // ! computed set 解析
    const next = path.getNextSibling();
    const nnode = next.node;
    // 是否是一个label（set: watch:）
    if (nnode && nnode.type === 'LabeledStatement') {
        if (nnode.label.name === 'set') {
            // @ts-ignore
            path.node.declarations.forEach(node => {
                // @ts-ignore
                node._computedSet = nnode.body;
            });
            // next.remove();
            // @ts-ignore
            nnode._shouldRemoved = true;
        }
    } else if (path.parent.type === 'ExportNamedDeclaration') {
        // @ts-ignore
        path.node.declarations.forEach(node => {
            // @ts-ignore
            node._export = true;
            // @ts-ignore
            node._parentPath = path;
        });
    }
}