
import type { NodePath, TraverseOptions } from '@babel/traverse';
import type { Program } from '@babel/types';
import type { IBabelType } from './types';
import { parseCommentMulti, parseVarDeclCommentReactive } from './comment';
import { parseInnerComponent } from './component/component';
import { currentModule as ctx, enterContext, exitContext } from './context';
import {
    createEmptyString, createExtendCalleeWrap, createUnfInit,
    extendCallee, getObjectPropValue, getT, initTypes, ModArrayFunc, parseComputedSet, parseFirstMemberObject,
} from './parse-utils';
import { isJsxExtendCall, isJsxExtendDef, isOriginJSXElement } from './is';
import { ImportManager } from './controller/import-manager';

export function createNodeVisitor (t: IBabelType, useImport = true) {
    initTypes(t);
    return {
        Program: {
            enter (path: NodePath<Program>) {
                enterContext(path);
                const body = path.node.body;
                for (let i = 0; i < body.length; i++) {
                    if (body[i]?.type !== 'ImportDeclaration') {
                        body.splice(i, 0, ImportManager.init(useImport, () => {
                            body.splice(i, 1);
                        }));
                        break;
                    }
                }
            },
            exit () {
                exitContext();
                ImportManager.exitModule();
            }
        },
        ImportDeclaration: (path) => {
            path.node._importReactive = parseCommentMulti(path.node);
        },
        'ImportDefaultSpecifier|ImportSpecifier|ImportNamespaceSpecifier' (path) {
            ctx.curScope.collectImportVar(path);
        },
        'AwaitExpression|ForAwaitStatement' () {
            ctx.curScope.collectAwait();
        },
        'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression': {
            enter (path) {
                if (isJsxExtendDef(path.node)) {
                    return path.remove();
                }
                // debugger;
                // console.log('ArrowFunctionExpression', path.toString());
                if (!ctx.enter(path)) return;

                if (path.node.type === 'FunctionDeclaration') {
                    // @ts-ignore
                    ctx.checkJsxComponent(path);
                    // @ts-ignore
                    ctx.curScope?.collectFuncVar(path);
                }

                // 标注是函数参数
                // @ts-ignore
                path.node._scopeEntry = true;
                // @ts-ignore
                path.node.params.forEach(node => {
                    if (node.type === 'ObjectPattern') {
                        node.properties.forEach(item => {
                            getObjectPropValue(item)._fnArg = true;
                        });
                    } else {
                        node._fnArg = true;
                    }
                });
                // if (path.node.async === true) {
                //     ctx.curScope.enterAsyncFunc(path);
                // }
                ctx.enterScope(path, true);
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
                // @ts-ignore
                if (!path.parent._scopeEntry) { // ! 父元素不是一个scope（不是函数）
                    ctx.enterScope(path);
                }
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
                if (!ctx) {
                    console.warn('Skip VariableDeclaration because ctx end');
                    path.skip();
                    return;
                }

                parseVarDeclCommentReactive(path.node);

                if (!ctx.enter(path)) return;

                // ! computed set 解析
                parseComputedSet(path);
                // console.log('NEXT', path.getNextSibling().node);
                ctx.enterVariableDeclaration(path.node);
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
        ForStatement (path) {
            const update = path.node.update;

            if (!update) return;

            // if(update.type === 'ExpressionS')

            update._isForUpdate = true;
        },
        VariableDeclarator: {
            enter (path) {
                if (!path.node.init) {
                    path.node.init = createUnfInit();
                }
                if (path.node.init.type === 'Identifier') {
                    path.node.init._isReplace = true;
                    // path.node.id._isReplace = true;
                }
                // @ts-ignore
                ctx.checkJsxComponent(path);
                // console.log(path.node.init);
                // console.log('VariableDeclaration:', path.toString());
                if (!ctx.enter(path)) return;
                // todo init = null 时 设置为 void 0;
                if (path.node.id.type === 'ObjectPattern') return;
                ctx.collectVar(path);
            },
            exit () {
                ctx.curScope.endDeclarator();
            }
        },
        AssignmentExpression (path) {
            const rightType = path.node.right.type;
            if (rightType === 'Identifier') {
                path.node.right._isReplace = true;
                // path.node.left._isReplace = true;
            }
            if (!ctx.enter(path)) return;
            if (isOriginJSXElement(rightType)) {
                // @ts-ignore
                path.node._skipAssign = true;
                return;
            }
            // @ts-ignore
            if (path.node._isForUpdate || path.node._skipAssign) return;
            // @ts-ignore
            const node = parseFirstMemberObject(path.node.left);
            ctx.markVarChange(node.name);
        },
        ReturnStatement (path) {
            if (!ctx.enter(path)) return;
            const node = path.node.argument;
            // @ts-ignore
            if (isOriginJSXElement(node?.type)) {
                ctx.mapScope?.markReturnJsx();
                ctx.curScope?.funcScope?.markReturnJsx();
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
            if (path.node._isForUpdate) return;
            const arg = path.node.argument;
            if (arg.type === 'MemberExpression') {
                const id = parseFirstMemberObject(arg);
                ctx.markVarChange(id.name);
            } else if (arg.type === 'Identifier') {
                ctx.markVarChange(arg.name);
            } else {
                console.warn('unknown UpdateExpression');
            }
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
                    // console.log('Expression', path.toString());
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
        'JSXSpreadAttribute' (path) {
            // @ts-ignore
            if (path.parent.attributes?.length === 1) {
                path.node.argument = createExtendCalleeWrap(
                    path.node.argument,
                    ctx.curScope.jsxScope.isJSXComp
                );
            }
        },
        JSXAttribute: {
            enter (path) {
                // @ts-ignore
                if (path.node._skip) return;
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
                if (isJsxExtendCall(path)) {
                    path.node.callee = extendCallee(ctx.curScope.jsxScope.isJSXComp);
                    return;
                }
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
                // if (ctx.curScope.inSwitch) {
                //     if (path.parent.type === 'SwitchCase') {
                //         // @ts-ignore
                //         path.parent._setBrk?.();
                //     } else {
                //         const parent = path.findParent(node => node.type === 'SwitchCase');
                //         // @ts-ignore
                //         parent?.node._setBrk?.();
                //     }
                // }
                path.replaceWith(getT().returnStatement());
            }
        }
    } as TraverseOptions<Node>;
}

export function createBabelPluginAlins () {
    return (data: any, args?: {useImport?: boolean}) => { // {import: boolean}
        return {
            name: 'babel-plugin-alins',
            visitor: createNodeVisitor(data.types, args?.useImport)
        };
    };
}