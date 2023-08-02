/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-30 16:07:45
 * @Description: Coding something
 */
import type {NodePath} from '@babel/traverse';
import type {Expression, FunctionDeclaration, Identifier, JSXExpressionContainer, Node, Program, VariableDeclaration, VariableDeclarator} from '@babel/types';
import {MapScope} from './controller/map';
import {isJsxCallee} from './is';
import {setContextGetter} from './parse-utils';
import {Scope} from './scope';
import type {CallExpression} from '@babel/types';
import {INodeTypeMap} from './types';

export let currentModule: Module = null as any;

// window.ctx = () => currentModule;

const NoNeedCollectVarMap: INodeTypeMap = {
    'ForInStatement': 1, 'ForOfStatement': 1, 'ForStatement': 1,
};
const NoNeedCollectIdentifierMap: INodeTypeMap = {
    // 'AssignmentExpression': 1,
    // 'FunctionDeclaration': 1,
    'JSXExpressionContainer': 1,
};
const NoNeedHandleJsxTypes: INodeTypeMap = {
    // 'JSXExpressionContainer': 1,
    'ArrowFunctionExpression': 1,
    'FunctionDeclaration': 1,
    'FunctionExpression': 1,
};

let moduleId = 0;

// let iii = 0;

export class Module {
    parent: Module = null as any;
    dependencies: Module[] = []; // 依赖项
    curScope: Scope = null as any;
    curDeclarationType: VariableDeclaration['kind'] = 'var';
    id = 0;
    constructor (path: NodePath<Program>) {
        this.id = moduleId++;
        this.enterScope(path);

        setContextGetter(() => {
            console.log(this, this.curScope);
            let scope = this.curScope;
            while (!scope.ctx && scope.parent) {
                scope = scope.parent;
            }
            return scope?.ctx?.node;
        });
    }
    enterScope (path: NodePath<Node>) {
        // iii ++;
        // console.log('SCOPE_DEBUG: enterScope', this.curScope?.inJsxTrans, path.toString(), iii);
        // ! 对于在jsx转换后的函数中 不需要进行scope处理 因为在jsx阶段已经处理过了
        if (this.curScope?.inJsxTrans) return;
        const newScope = new Scope(path, this);
        newScope.parent = this.curScope;
        newScope.deep = this.curScope ? (this.curScope.deep + 1) : 0;
        this.curScope = newScope;
        // console.log('AlinsCtx enterScope', newScope.id, newScope.deep, path.toString());
        // debugger;
    }
    exitScope (path?: NodePath<Node>) {
        // iii --;
        // console.log('SCOPE_DEBUG: exitScope', this.curScope?.inJsxTrans, path?.toString(), iii);
        if (this.curScope.inJsxTrans) return;
        // ! 没有使用到的 ctx 则删除
        const scope = this.curScope;
        // debugger;
        // console.log('AlinsCtx exit Scope', scope.ctx?.node?._used, scope.id, scope.deep, scope.path.toString());
        if (scope.ctx && !scope.ctx.node._used) {
            scope.ctx.remove();
        }
        scope.exit();
        this.curScope = scope.parent;
        // console.log('SCOPE-DEBUG Exit:', scope.path.toString());
    }
    needCollectVar () {
        return !NoNeedCollectVarMap[this.curScope.node.type];
    }
    enter (path: NodePath<any>) {
        if (path.node._skip) { // _skip 属性优先级最高 直接跳过
            path.skip();
            return false;
        }
        // console.log(path.toString());
        if (!this.curScope) return false;
        if (this.curScope.inJsxTrans) return true; // 在 jsx 转译后的代码中需要向下遍历
        if (isJsxCallee(path)) {
            // debugger;
            // jsx 转译后的代码
            this.curScope.enterJsxScope(path);
            return true;
        }
        // if (isSkippedNewNode(path)) { // ! 新增加点跳过遍历
        //     // console.warn(`ENTER Skip: ${path.node.type}-${path.toString()}`, path.node.object);
        //     path.skip();
        //     return false;
        // }

        // console.warn(`ENTER: ${path.node.type}-${path.toString()}`, path.node.object);
        return true;
    }
    enterVariableDeclaration (node: VariableDeclaration) {

        this.curDeclarationType = node.kind;
    }
    collectVar (path: NodePath<VariableDeclarator>) {
        if (!this.needCollectVar()) return;
        // console.log(path.toString());
        this.curScope.collectVar(this.curDeclarationType, path);
    }
    // ! 值有改变 改变所有依赖; 这个变量可能在祖先域内定义；所以要溯源
    markVarChange (name: string) {
        // console.log('marVariableChange', name);

        // const variable = scope.findVarDeclare(name);

        // if (!variable) return;
        this.curScope.markVariableReactive(name);
        // if()

    }

    enterIdentifier (path: NodePath<Identifier>) {
        if (path.node._deco) return; // 装饰器jsx直接表达式需要跳过 ! value:number={a}
        if (!!NoNeedCollectIdentifierMap[path.parent.type]) {
            return;
        }
        if (path.parent.type === 'ObjectProperty' && path.parent.key === path.node) {
            return;
        }
        const scope = this.curScope;
        // 非首个member identify
        if (path.parent.type === 'MemberExpression' && !path.node._firstMember) {
            return;
        }
        // @ts-ignore
        if (path.node._fnArg === true) {
            // 函数参数
            console.log('函数参数: path.parent === scope.node', path.node.name);
            scope.collectParam(path);
        } else {
            // console.log('collectIdentifier 1111', path.toString());
            scope.collectIdentifier(path);
        }
        // if (lastNodeType === 'MemberExpression') {
        //     path.replaceWith(createReadValue(path.node.name));
        //     path.skip();
        // } else if (
        //     path.parent.type !== 'CallExpression' &&
        //     path.parent.type !== 'MemberExpression' &&
        //     path.parent.type !== 'VariableDeclarator'
        // ) {
        //     path.replaceWith(createReadValue(path.node.name));
        // }

    }
    enterJSXExpression (path: NodePath<Expression>) {
        // debugger;
        this.curScope.enterJSXExpression(path);
    }
    enterJSXExpContainer (path: NodePath<JSXExpressionContainer>) {
        const exp = path.node.expression;
        if (exp.type === 'Identifier') {
            path.node.expression._skip = true;
            return;
        }
        if (!!NoNeedHandleJsxTypes[exp.type]) {
            return;
        }
        // debugger;
        path.node.expression._needJsxRefeat = true;
        // debugger;
        this.curScope.enterJSXExpression(path);
    }

    // MapScope
    mapScope: MapScope|null = null;
    enterMapScope (path: NodePath<CallExpression>) {
        // debugger;
        const newScope = new MapScope(path, this.curScope);
        newScope.module = this;
        if (this.mapScope) {
            newScope.parent = this.mapScope;
        }
        this.mapScope = newScope;
        if (this._lastReturnJsx) this._lastReturnJsx = false;
    }
    private _lastReturnJsx = false;
    exitMapScope (scope: MapScope) {
        // debugger;
        if (!this.mapScope) return;

        if (
            this.mapScope?.isArrowFnReturnJsx ||
            (!this.mapScope.isReturnJsx && this._lastReturnJsx)
        ) {
            this.mapScope.markReturnJsx();
        }
        if (scope !== this.mapScope) {
            console.error('scope !== this.mapScope');
            return;
        }
        this._lastReturnJsx = this.mapScope.isReturnJsx;
        this.mapScope.onExit();
        this.mapScope = this.mapScope.exit();
    }
    get inMap () {
        return !!this.mapScope;
    }

    jsxFlagStackDeep = 0;
    checkJsxComponent (path: NodePath<FunctionDeclaration|VariableDeclarator>) {
        let name = '';
        if (path.node.type === 'FunctionDeclaration') {
            name = path.node.id?.name;
        } else {
            const init = path.node.init;
            if (init?.type === 'ArrowFunctionExpression' || init?.type === 'FunctionExpression') {
                // debugger;
                name = path.node.id;
            }
        }
        let isComp = false;
        if (name) {
            if (name.charCodeAt(0) <= 90) {
                // 首字母大写的函数
                const firstArg = path.node.params[0];
                if (firstArg) {
                    if (firstArg.type === 'Identifier') {
                        if (firstArg.name === 'props') {
                            firstArg._isProps = true;
                            isComp = true;
                        }
                    } else if (firstArg.type === 'ObjectPattern') {
                        firstArg.properties.forEach(item => {
                            item.value._isReactive = true;
                        });
                        isComp = true;
                    }
                }
            }
        }
        if (isComp) {
            this.jsxFlagStackDeep ++;
            path.node._jsxComp = true;
        }
        return isComp;
    }
    exitJsxComponent (path: any) {
        if (path.node._jsxComp) {
            this.jsxFlagStackDeep --;
        }
    }
    get inJsxComp () {
        return this.jsxFlagStackDeep > 0;
    }
}

export function enterContext (path: NodePath<Program>) {
    const newModule = new Module(path);
    if (currentModule) {
        currentModule.dependencies.push(newModule);
    }
    currentModule = newModule;
}

export function exitContext () {
    currentModule.exitScope();
    currentModule = currentModule.parent;
}


