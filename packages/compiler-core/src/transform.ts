
import type {NodePath, Node, TraverseOptions} from '@babel/traverse';
import type {Program} from '@babel/types';
import type {IBabelType} from './types';
import {parseCommentReactive} from './comment';
import {parseInnerComponent} from './component/component';
import {currentModule as ctx, enterContext, exitContext} from './context';
import {createAlinsCtx, createEmptyString, createUnfInit, getT, initTypes, ModArrayFunc, parseFirstMemberObject} from './parse-utils';

export function createNodeVisitor (t: IBabelType) {
    initTypes(t);
    return {
        Program: {
            enter (path: NodePath<Program>) {
                enterContext(path);
                const body = path.node.body;
                for (let i = 0; i < body.length; i++) {
                    if (body[i]?.type !== 'ImportDeclaration') {
                        body.splice(i, 0, createAlinsCtx(true));
                        return;
                    }
                }
            },
            exit () {
                exitContext();
                // window.aaa?.();
            }
        },
        ImportDeclaration: (path) => {
            path.node._importReactive = parseCommentReactive(path.node);
        },
        'ImportDefaultSpecifier|ImportSpecifier|ImportNamespaceSpecifier' (path) {
            ctx.curScope.collectImportVar(path);
        },
        'AwaitExpression|ForAwaitStatement' (path) {
            ctx.curScope.collectAwait();
        },
        'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression': {
            enter (path) {
                // debugger;
                // console.log('ArrowFunctionExpression', path.toString());
                if (!ctx.enter(path)) return;

                if (path.node.type === 'FunctionDeclaration') {
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
                path.node._scopeEntry = true;
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
                if (path.node._mapScope) {
                    ctx.exitMapScope(path.node._mapScope);
                }
                ctx.exitScope(path);
                ctx.exitJsxComponent(path);
            }
        },
        BlockStatement: {
            enter (path) {
                if (!ctx.enter(path)) return;
                // console.log('BlockStatement', path.toString());
                if (!path.parent._scopeEntry) { // ! 父元素不是一个scope（不是函数）
                    ctx.enterScope(path);
                }
                // ! 函数作用域
                if (!ctx.curScope.inJsxTrans && path.parent.type.includes('Function')) {
                    path.unshiftContainer('body', createAlinsCtx());
                }
            },
            exit (path) {
                if (!path.parent._scopeEntry) {
                    ctx.exitScope(path);
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
                if (path.node._isCtx) { // ! 是否是生成的alins ctx
                    path.node._isCtx = false;
                    ctx.curScope.ctx = path;
                }
                if (!ctx.enter(path)) return;

                ctx.checkJsxComponent(path);

                // ! computed set 解析
                const next = path.getNextSibling();
                const nnode = next.node;
                // 是否是一个label（set: watch:）
                if (nnode && nnode.type === 'LabeledStatement') {
                    if (nnode.label.name === 'set') {
                        path.node.declarations.forEach(node => {
                            node._computedSet = nnode.body;
                        });
                        // next.remove();
                        nnode._shouldRemoved = true;
                    }
                } else if (path.parent.type === 'ExportNamedDeclaration') {
                    path.node.declarations.forEach(node => {
                        node._export = true;
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
            if (node?.type === 'JSXElement' || node?.type === 'JSXFragment') {
                ctx.mapScope?.markReturnJsx();
            }
        },
        MemberExpression (path) {
            // console.log('MemberExpression', path.toString(), path.node._skip);
            const pnode = path.node;
            if (!ctx.enter(path)) return;

            if (path.node._propNode) {
                path.node._propNode._secondPath = path;
            }

            const node = parseFirstMemberObject(pnode, (n2, n1) => {
                if (ctx.inJsxComp && n1.name === 'props') {
                    // jsx 组件的props
                    n2._propNode = n1;
                    if (n2 === pnode) {
                        n1._secondPath = path;
                    }
                }
            });

            node._firstMember = true;

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
                if (ctx.curScope.inJsxTrans && path.node._needJsxRefeat) {
                    ctx.enterJSXExpression(path);
                }
            },
            exit (path) {
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
                ctx.curScope.jsxScope.exitJsxElement(path);
            }
        },
        JSXElement: {
            enter (path) {
                // if(path.node)
                // console.log('SCOPE_DEBUG_JSX JSXElement', path.toString());
                if (parseInnerComponent(path)) {
                    path.node._innerComp = true;
                    return;
                }
                ctx.curScope.jsxScope.enterJsxElement(path);
            },
            exit (path) {
                if (path.node._innerComp) {
                    return;
                }
                // console.log('SCOPE_DEBUG_JSX JSXElement', path.toString());
                ctx.curScope.jsxScope.exitJsxElement(path);
            }
        },
        JSXAttribute: {
            enter (path) {
                // console.log('JSXAttr_Debug enter', path.toString());
                ctx.curScope.jsxScope.enterJSXAttribute(path);
            },
            exit (path) {
                // console.log('JSXAttr_Debug exit', path.toString());
                ctx.curScope.jsxScope.exitJSXAttribute();
            }
        },
        CallExpression: {
            enter (path) {
                // console.log('CallExpression', path.toString(), path.node._skip);
                // debugger;
                if (!ctx.enter(path)) return;
                const callee = path.node.callee;
                if (callee.type === 'MemberExpression') {
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
                if (path.node._jsxScope) {
                    // console.warn(`Exit JSX Scope: ${path.node.type}-${path.toString()}`, path.node.object);
                    ctx.curScope.exitJsxScope(path);
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
            exit (path) {
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
                        path.parent._setBrk?.();
                    } else {
                        const parent = path.findParent(node => node.type === 'SwitchCase');
                        parent?.node._setBrk?.();
                    }
                }
                path.replaceWith(getT().returnStatement());
            }
        }
    } as TraverseOptions<Node>;
}

export function babelPluginAlins (data: any) {
    return {
        name: 'babel-plugin-alins',
        visitor: createNodeVisitor(data.types)
    };
}