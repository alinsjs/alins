/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-29 15:18:14
 * @Description: Coding something
 */
import type { NodePath } from '@babel/traverse';
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
    Node,
    JSXAttribute,
    ObjectProperty,
    LabeledStatement,
    JSXElement
} from '@babel/types';
import type { IBabelType } from './types';
import { BlockReturnType, isBlockBreak, isBlockReturned, isEventEmptyDeco, isMemberExp } from './is';
import type { Module } from './context';
import { AlinsStr, AlinsVar, ImportManager } from './controller/import-manager';

export let t: IBabelType;

export function getT () {
    return t;
}
export function initTypes (types: IBabelType) {
    t = types;
}

let currentModule: Module;

export function getCurModule () {
    return currentModule;
}
export function initCurModule (m: Module) {
    currentModule = m;
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

export function createMemberExp (id: string, prop: string) {
    return t.memberExpression(
        t.identifier(id),
        t.identifier(prop)
    );
}

export function replaceJsxDomCreator (path: NodePath<CallExpression>) {
    return createCtxCall(AlinsVar.Create, path.node.arguments);
}

// ! 暂时先全部用v包裹 后续优化
export function createReadValue (idName: string) {
    const node = createMemberExp(idName, AlinsStr.Value);
    // @ts-ignore
    node._skip = true;
    return node;
}

function createFullComputed (get: any, set: any) {
    return t.objectExpression([
        t.objectProperty(t.identifier('get'), get),
        t.objectProperty(t.identifier('set'), set),
    ]);
}

export function createComputed (node: VariableDeclarator) {
    const get = t.arrowFunctionExpression([], node.init as any);
    let target: any;
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
    return createCtxCall(AlinsVar.Computed, [ fn ]);
}

export function createCtxCall (name: AlinsVar, args: any[]) {
    return t.callExpression(
        ImportManager.use(name),
        args
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
    let call: any = t.arrowFunctionExpression(
        [], exp
    );

    if (exp.type === 'UpdateExpression') {
        call = createCtxCall(AlinsVar.MarkUpdate, [ call ]);
    }

    // 标注当前是否在JSX组件中，组件中需要被转成 _$$.c()
    const computed = isComp ? createComputeCall(call) : call;
    const result = isContainer ? t.jsxExpressionContainer(computed) : computed;
    // @ts-ignore
    result._handled = true;
    // @ts-ignore
    exp._handled = true;

    return result;
}

export function skipNode<T> (node: T, _skip = true): T {
    // @ts-ignore
    node._skip = _skip;
    return node;
}

export function createReact (node: VariableDeclarator) {
    // return callExpression(
    //     identifier('react'),
    //     [ identifier(idName) ]
    // );
    // debugger;
    // console.log('wrap react-------', node.id.name);
    const args: any[] = [ node.init ];
    if (node._isShallow) {
        args.push(t.booleanLiteral(true));
    }
    return skipNode(t.variableDeclarator(
        node.id,
        createCtxCall(AlinsVar.React, args),
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
    while (isMemberExp(node)) {
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
    const v = AlinsStr.Value;
    return t.memberExpression(
        createCtxCall(AlinsVar.Watch, [
            t.arrowFunctionExpression([], createMemberExp(alias, v)),
            t.arrowFunctionExpression([], t.assignmentExpression('=', t.identifier(name), t.identifier(v))),
            t.booleanLiteral(false),
        ]),
        t.identifier(v),
    );
}

function transformToBlock (body: any) {
    // 对于没有{}的语句 进行block包裹
    if (body.type !== 'BlockStatement') {
        body = t.blockStatement(Array.isArray(body) ? body : [ body ]);
    }
    // body._noBreak = true;
    return body;
}

export function traverseIfStatement (node: IfStatement, map: any = { elif: [] }, i = 0) {
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
    let isReturnJsx = false;

    const breakList: any = [];

    let childrenList: any[][] = [];
    let isLastBreak = true;

    const cases = t.arrayExpression(node.cases.map(item => {
        const { test, consequent: cons } = item;
        const bodyArr: any = [];
        for (const single of cons) {
            if (single.type === 'BlockStatement') {
                bodyArr.push(...single.body);
            } else if (single.type === 'EmptyStatement') {
                continue;
            } else {
                bodyArr.push(single);
            }
        }
        const body = transformToBlock(bodyArr);
        const returnType = isBlockReturned(body, () => {
            isReturnJsx = true;
        });

        if (!isReturnJsx) {
            isReturnJsx = (returnType === BlockReturnType.Jsx);
        }

        const isBreak = !!returnType || isBlockBreak(bodyArr, node => {breakList.push(node);});
        if (!isLastBreak) {
            childrenList.forEach(item => {item.push(...bodyArr);});
        }
        if (!isBreak) {
            childrenList.push(bodyArr);
        } else {
            childrenList = [];
        }
        isLastBreak = isBreak;

        const array = t.arrayExpression([
            // ! !test 为 default
            !test ? t.nullLiteral() : test,
            body.length === 0 ? t.nullLiteral() : markMNR(t.arrowFunctionExpression([], body)),
        ]);
        return array;
    }));

    const endFunc = createSetAsyncArrowFunc(t.blockStatement([]));

    if (isReturnJsx) {
        breakList.forEach(node => {node.type = 'ReturnStatement';});
    }

    return {
        endFunc,
        isReturnJsx,
        node: t.callExpression(
            t.memberExpression(
                createCtxCall(AlinsVar.Switch, [ discr, cases ]),
                t.identifier('end')
            ),
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

export function markMNR (fn: any, returnJsxCall?: ()=>void) {
    if (fn._mnrMarked) return fn;

    const returnType = isBlockReturned(fn.body, returnJsxCall);
    if (!returnType) {
        fn._mnrMarked = true;
        // ! 标注是否有返回值
        return createCtxCall(AlinsVar.MNR, [ fn ]);
    } else if (returnType === BlockReturnType.Jsx) {
        returnJsxCall?.();
    }
    return fn;
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

export function extendCallee (isComp: boolean) {
    return ImportManager.use(isComp ? AlinsVar.ExtendComp : AlinsVar.Extend);
}

export function createExtendCalleeWrap (arg: any, isComp: boolean) {
    return t.callExpression(
        extendCallee(isComp),
        [ arg ]
    );
}

export function createJsxAttr (name: string, value: any) {
    return t.jsxAttribute(
        t.jsxIdentifier(name),
        value,
    );
}

export function parseAttributes (attrs: JSXAttribute[], handleReactive?: boolean) {
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.type === 'JSXAttribute') {
            const newAttr = createNewJSXAttribute(attr, handleReactive);
            if (newAttr) {
                attrs[i] = newAttr;
            }
        }
    }
}

export function parseJsxAttrShort (path: NodePath<JSXAttribute>) {
    const nodeValue = path.node.value;
    if (nodeValue) return false;

    const newAttr = createNewJSXAttribute(path.node);
    if (newAttr) {
        path.replaceWith(newAttr);
        return true;
    }
    return false;
}

function createNewJSXAttribute (node: JSXAttribute, handleReactive?: boolean) {
    const key = node.name;
    if (key.type === 'JSXNamespacedName') {
        const name = key.namespace.name;
        if (name === '$') {
            // ! $:App => $mount='#App'
            return createJsxAttr('$mount', t.stringLiteral(`#${key.name.name}`));
        }
        const deco = key.name.name;
        // ! 处理 onclick:stop
        if (isEventEmptyDeco(name, deco, node.value)) {
            node.value = t.jsxExpressionContainer(t.arrowFunctionExpression([], t.blockStatement([])));
            return;
        }
        return createWrapAttr(key.namespace.name, key.name.name, false, handleReactive);
    } else {
        let name = key.name;
        if (name[0] === '$') {
            // ! 去除 $$App 的简写 v0.0.35
            // if (name[1] === '$') {
            //     name = name.substring(2);
            //     return createWrapAttr('$mount', getT().stringLiteral(`#${name}`), true);
            // } else {
            name = name.substring(1);
            return createWrapAttr(name, name);
            // }
        }
    }
    return null;
}

export function createWrapAttr (name: string, value: any, wrap = false, handleReactive?: boolean) {
    const t = getT();
    if (typeof value === 'string') {
        value = t.jsxExpressionContainer(t.identifier(value));
        if (handleReactive) {
            getCurModule().curScope.checkIdentifier(value.expression, (newNode) => {
                value.expression = newNode;
            });
        }
    } else if (wrap) {
        value = t.jsxExpressionContainer(value);
    }
    return createJsxAttr(name, value);
}

export function getObjectPropValue (node: ObjectProperty, mock = false) {
    const value = node.value;
    if (value.type === 'AssignmentPattern') {
        if (mock) value.right = createCtxCall(AlinsVar.MockRef, [ value.right ]);
        return value.left;
    }
    return value;
}

export function transformWatchLabel (node: LabeledStatement) {
    // @ts-ignore
    const args = node.body?.expression?.expressions;
    if (args) {
        const target = args[0];
        if (
            target.type !== 'Identifier' &&
            target.type !== 'ArrowFunctionExpression'
        ) {
            args[0] = t.arrowFunctionExpression([], target);
        }
        args[0]._handled = true;
        return createCtxCall(AlinsVar.Watch, args);
    }
    return null;
}

export function transformDataLabel (node: LabeledStatement, isStatic = true, shallow = false) {

    // @ts-ignore
    const exp = node.body?.expression;

    if (!exp || (exp.type !== 'AssignmentExpression' && exp.operator === '=')) {
        // ! 处理其他支持 $: 的逻辑
        if (node.body.type === 'SwitchStatement' || node.body.type === 'IfStatement') {
            node.body._isComReact = true;
            return node.body;
        }
        return null;
    };

    const varNode = t.variableDeclarator(
        exp.left, exp.right
    );

    varNode[isStatic ? '_isComStatic' : '_isComReact'] = true;

    if (!isStatic && shallow) {
        varNode._isShallow = true;
    }

    return createVarDeclaration('let', [ varNode ]);
}

export function findAttributes (node: JSXElement, name: string|((attrName: string)=>boolean)): JSXAttribute|null {
    const attrs = node.openingElement?.attributes;

    if (!attrs) return null;
    // @ts-ignore
    return attrs.find(attr => {
        if (
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier'
        ) {
            const attrName = attr.name.name;
            return (typeof name === 'function') ? name(attrName) : attrName === name;
        }
        return false;

    });
}

export function transformMountLabel (node: LabeledStatement) {
    // @ts-ignore
    const exp = node.body?.expression;
    if (!exp) return null;
    const args = exp.expressions || [ exp ];
    return createCtxCall(AlinsVar.Mount, args);
}

export function transformLifeLabel (name: string, node: LabeledStatement) {
    // @ts-ignore
    const exp = node.body?.expression;
    if (!exp) return null;
    return createCtxCall(AlinsVar[name], [ exp ]);
}