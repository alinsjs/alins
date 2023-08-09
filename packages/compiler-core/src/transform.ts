
import type {NodePath, TraverseOptions} from '@babel/traverse';
import type {Program} from '@babel/types';
import type {IBabelType} from './types';
import {parseCommentReactive} from './comment';
import {parseInnerComponent} from './component/component';
import {currentModule as ctx, enterContext, exitContext} from './context';
import {createAlinsCtx, createEmptyString, createUnfInit, getT, initTypes, ModArrayFunc, parseFirstMemberObject} from './parse-utils';

export function createNodeVisitor (t: IBabelType, isWeb = false) {
    initTypes(t);
    return {
        Program: {
            enter (path: NodePath<Program>) {
                enterContext(path);
                const body = path.node.body;
                for (let i = 0; i < body.length; i++) {
                    if (body[i]?.type !== 'ImportDeclaration') {
                        body.splice(i, 0, createAlinsCtx());
                        break;
                    }
                }

                const define = isWeb ? t.variableDeclaration('var', [
                    t.variableDeclarator(t.identifier('_$$'), t.memberExpression(
                        t.memberExpression(t.identifier('window'), t.identifier('Alins')),
                        t.identifier('_$$'),
                    ))
                ]) : t.importDeclaration([
                    t.importSpecifier(t.identifier('_$$'), t.identifier('_$$'))
                ], t.stringLiteral('alins'));
                body.unshift(define);
            },
            exit () {
                exitContext();
                // window.aaa?.();
            }
        },
        ImportDeclaration: (path) => {
            // @ts-ignore
            path.node._importReactive = parseCommentReactive(path.node);
        },
        'ImportDefaultSpecifier|ImportSpecifier|ImportNamespaceSpecifier' (path) {
            ctx.curScope.collectImportVar(path);
        },
        'AwaitExpression|ForAwaitStatement' () {
            ctx.curScope.collectAwait();
        },
        'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression': {
            enter (path) {
                // debugger;
                // console.log('ArrowFunctionExpression', path.toString());
                if (!ctx.enter(path)) return;

                if (path.node.type === 'FunctionDeclaration') {
                    // @ts-ignore
                    ctx.checkJsxComponent(path);
                }

                // if (path.node.body.type !== 'BlockStatement') {
                //     const t = getT();
                //     const b = t.arrowFunctionExpression(
                //         path.node.params,
                //         t.blockStatement([ t.returnStatement(path.node.body) ])
                //     );

                //     // b._skip = false;
                //     path.replaceWith(b);
                // }

                // 标注是函数参数
                // @ts-ignore
                path.node._scopeEntry = true;
                // @ts-ignore
                path.node.params.forEach(node => {
                    if (node.type === 'ObjectPattern') {
                        node.properties.forEach(item => {
                            item.value._fnArg = true;
                        });
                    } else {
                        node._fnArg = true;
                    }
                });
                // if (path.node.async === true) {
                //     ctx.curScope.enterAsyncFunc(path);
                // }
                ctx.enterScope(path);
            },
            exit (path) {
                // @ts-ignore
                if (path.node._mapScope) {
                // @ts-ignore
                    ctx.exitMapScope(path.node._mapScope);
                }
                ctx.exitScope();
                ctx.exitJsxComponent(path);
            }
        },
        BlockStatement: {
            enter (path) {
                if (!ctx.enter(path)) return;
                // console.log('BlockStatement', path.toString());
                // @ts-ignore
                if (!path.parent._scopeEntry) { // ! 父元素不是一个scope（不是函数）
                    ctx.enterScope(path);
                }
                // // ! 函数作用域
                // if (!ctx.curScope.inJsxTrans && path.parent.type.includes('Function')) {
                //     path.unshiftContainer('body', createAlinsCtx());
                // }
            },
            exit (path) {
                // @ts-ignore
                if (!path.parent._scopeEntry) {
                    ctx.exitScope();
                }
            }
        },
        VariableDeclaration: {
            enter (path) {
                // console.log('VariableDeclaration:', path.toString());
                // debugger;
                if (!ctx) {
                    console.warn('Skip VariableDeclaration because ctx end');
                    path.skip();
                    return;
                }
                // @ts-ignore
                if (path.node._isCtx) { // ! 是否是生成的alins ctx
                // @ts-ignore
                    path.node._isCtx = false;
                    ctx.ctx = path;
                }
                if (!ctx.enter(path)) return;

                // @ts-ignore
                ctx.checkJsxComponent(path);

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

                // console.log('NEXT', path.getNextSibling().node);
                // debugger;
                ctx.enterVariableDeclaration(path.node);
                // add(path, 'VariableDeclaration', true);
            },
            exit (path) {
                ctx.exitJsxComponent(path);
            }
        },
        LabeledStatement: {
            exit (path) {
                // @ts-ignore
                if (path.node._shouldRemoved) { // ! 移除需要删除的label
                    path.remove();
                }
            }
        },
        VariableDeclarator: {
            enter (path) {
                if (!path.node.init) {
                    path.node.init = createUnfInit();
                }
                if (!ctx.enter(path)) return;
                // todo init = null 时 设置为 void 0;
                // if (path.node.id.name === 'c') debugger;
                ctx.collectVar(path);
            },
            exit () {
                ctx.curScope.endDeclarator();
            }
        },
        ReturnStatement (path) {
            if (!ctx.enter(path)) return;
            const node = path.node.argument;
            // debugger;
            // @ts-ignore
            if (node?.type === 'JSXElement' || node?.type === 'JSXFragment') {
            // if (isJSXElement(node) || (
            //     node?.type === 'JSXElement' || node?.type === 'JSXFragment'
            // )) {
                ctx.mapScope?.markReturnJsx();
            }
        },
        MemberExpression (path) {
            // console.log('MemberExpression', path.toString(), path.node._skip);
            const pnode = path.node;
            if (!ctx.enter(path)) return;

            // @ts-ignore
            if (path.node._propNode) {
                // @ts-ignore
                path.node._propNode._secondPath = path;
            }

            const node = parseFirstMemberObject(pnode, (n2, n1) => {
                // @ts-ignore
                if (ctx.inJsxComp && n1.name === 'props') {
                    // jsx 组件的props
                // @ts-ignore
                    n2._propNode = n1;
                    if (n2 === pnode) {
                        // @ts-ignore
                        n1._secondPath = path;
                    }
                }
            });

            // @ts-ignore
            node._firstMember = true;

            // @ts-ignore
            if (node.name === 'React' && pnode.property.name === 'Fragment' && path.parent._jsxScope) {
                path.replaceWith(createEmptyString());
            }

        },
        Identifier (path) {
            if (!ctx.enter(path)) return;
            ctx.enterIdentifier(path);

        },
        UpdateExpression (path) {
            if (!ctx.enter(path)) return;
            // @ts-ignore
            ctx.markVarChange(path.node.argument.name);
        },
        AssignmentExpression (path) {
            if (!ctx.enter(path)) return;
            // @ts-ignore
            const node = parseFirstMemberObject(path.node.left);
            ctx.markVarChange(node.name);
        },
        Expression: {
            enter (path) {
                if (!ctx.enter(path)) return;
                // @ts-ignore
                if (ctx.curScope.inJsxTrans && path.node._needJsxRefeat) {
                    ctx.enterJSXExpression(path);
                }
            },
            exit (path) {
                // @ts-ignore
                if (ctx.curScope?.inJsxTrans && path.node._needJsxRefeat) {
                    ctx.curScope.exitJSXExpression();
                }
            }
        },
        JSXFragment: {
            enter (path) {
                ctx.curScope.jsxScope.enterJsxElement(path);
            },
            exit (path) {
                // @ts-ignore
                ctx.curScope.jsxScope.exitJsxElement(path);
            }
        },
        JSXElement: {
            enter (path) {
                // if(path.node)
                // console.log('SCOPE_DEBUG_JSX JSXElement', path.toString());
                // @ts-ignore
                if (parseInnerComponent(path)) {
                // @ts-ignore
                    path.node._innerComp = true;
                    return;
                }
                ctx.curScope.jsxScope.enterJsxElement(path);
            },
            exit (path) {
                // @ts-ignore
                if (path.node._innerComp) {
                    return;
                }
                // console.log('SCOPE_DEBUG_JSX JSXElement', path.toString());
                // @ts-ignore
                ctx.curScope.jsxScope.exitJsxElement(path);
            }
        },
        JSXAttribute: {
            enter (path) {
                // console.log('JSXAttr_Debug enter', path.toString());
                ctx.curScope.jsxScope.enterJSXAttribute(path);
            },
            exit () {
                // console.log('JSXAttr_Debug exit', path.toString());
                ctx.curScope.jsxScope.exitJSXAttribute();
            }
        },
        CallExpression: {
            enter (path) {
                // debugger;
                if (!ctx.enter(path)) return;
                const callee = path.node.callee;
                if (callee.type === 'MemberExpression') {
                    // @ts-ignore
                    const prop = callee.property.name;
                    // path.node._mapScope = true;
                    // debugger;
                    if (prop === 'map') {
                        ctx.enterMapScope(path);
                    } else if (ModArrayFunc[prop]) {
                        // 数组修改方法
                        const id = parseFirstMemberObject(callee);
                        ctx.markVarChange(id.name);
                    }
                }
            },
            exit (path) {
                // @ts-ignore
                if (path.node._jsxScope) {
                    // console.warn(`Exit JSX Scope: ${path.node.type}-${path.toString()}`, path.node.object);
                    ctx.curScope.exitJsxScope();
                    // @ts-ignore
                    path.node._jsxScope = false;
                }
                // if (path.node._mapScope) {
                //     ctx.curScope.exitMapScope(path);
                // }
            }
        },
        JSXExpressionContainer: {
            enter (path) {
                ctx.curScope.jsxScope.collectJsxExp(path.node);
                // console.warn(`path:JSXExpressionContainer=${path.toString()}`);
                if (!ctx.enter(path)) return;
                // console.log('JSX-DEBUG:', `JSXExpressionContainer: ${path.toString()}`);
                ctx.enterJSXExpContainer(path);
            },
            // @ts-ignore
            exit () {
                // console.log('JSX-DEBUG:', `exit JSXExpressionContainer: ${path.toString()}`);
                ctx.curScope.exitJSXExpression();
            }
        },

        IfStatement: {
            enter (path) {
                // console.log('Expression', path.toString());
                if (!ctx.enter(path)) return;
                ctx.curScope.enterIfScope(path);
            },
            exit (path) {
                ctx.curScope.exitIfScope(path);
            }
        },
        SwitchStatement: {
            enter (path) {
                // console.log('Expression', path.toString());
                if (!ctx.enter(path)) return;
                ctx.curScope.enterSwitchScope(path);
            },
            exit (path) {
                ctx.curScope.exitSwitchScope(path);
            }
        },
        BreakStatement (path) {
            // console.log(ctx.curScope);
            if (ctx.curScope.inIf || ctx.curScope.inSwitch) {
                if (ctx.curScope.inSwitch) {
                    if (path.parent.type === 'SwitchCase') {
                        // @ts-ignore
                        path.parent._setBrk?.();
                    } else {
                        const parent = path.findParent(node => node.type === 'SwitchCase');
                        // @ts-ignore
                        parent?.node._setBrk?.();
                    }
                }
                path.replaceWith(getT().returnStatement());
            }
        }
    } as TraverseOptions<Node>;
}

export function createBabelPluginAlins (isWeb?: boolean) {
    return (data: any, args: any) => {
        if (args.web === true) {
            isWeb = true;
        }
        return {
            name: 'babel-plugin-alins',
            visitor: createNodeVisitor(data.types, isWeb)
        };
    };
}