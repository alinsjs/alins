/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-30 16:07:45
 * @Description: Coding something
 */
import type { NodePath } from '@babel/traverse';
import type { CallExpression, Expression, FunctionDeclaration, Identifier, JSXExpressionContainer, Node, Program, VariableDeclaration, VariableDeclarator } from '@babel/types';
import { parseCommentSingle, RegMap } from './comment';
import { MapScope } from './controller/map';
import { isComponentFunc, isJsxCallee, isMemberExp } from './is';
import { getObjectPropValue, initCurModule } from './parse-utils';
import { Scope } from './scope';
import { INodeTypeMap } from './types';

export let currentModule: Module = null as any;

const NoNeedCollectVarMap: INodeTypeMap = {
    'ForInStatement': 1, 'ForOfStatement': 1, 'ForStatement': 1,
};
const NoNeedCollectIdentifierMap: INodeTypeMap = {
    // 'AssignmentExpression': 1,
    // 'FunctionDeclaration': 1,
    'JSXExpressionContainer': 1,
    'ObjectMethod': 1,
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


    isInStaticScope = false;
    constructor (path: NodePath<Program>) {
        this.id = moduleId++;
        this.enterScope(path);
    }
    checkStaticScope (path: NodePath<Node>) {
        if (this.isInStaticScope) return;
        const node = path.node;

        const comment = parseCommentSingle(node, RegMap.StaticScope);
        const markStatic = () => {
            this.isInStaticScope = true;
            // @ts-ignore
            node._isStaticScope = true;
        };
        if (comment) {
            markStatic();
            return;
        }
        if (node.type === 'FunctionDeclaration') {
            if (node.id?.name[0] === '_') markStatic();
        } else if (
            node.type === 'ArrowFunctionExpression' ||
            node.type === 'FunctionExpression'
        ) {
            if (
                path.parent.type === 'VariableDeclarator' &&
                // @ts-ignore
                path.parent.id?.name[0] === '_'
            ) {
                markStatic();
            }
        }
    }
    checkExitStaticScope (node: any) {
        if (this.isInStaticScope && node._isStaticScope) {
            this.isInStaticScope = false;
        }
    }
    exitModule () {

    }
    enterScope (path: NodePath<Node>, isFunc = false) {

        // iii ++;
        // console.log('SCOPE_DEBUG: enterScope', this.curScope?.inJsxTrans, path.toString(), iii);
        // ! 对于在jsx转换后的函数中 不需要进行scope处理 因为在jsx阶段已经处理过了
        if (this.curScope?.inJsxTrans) return;
        const newScope = new Scope(path, this, isFunc);
        newScope.parent = this.curScope;
        newScope.deep = this.curScope ? (this.curScope.deep + 1) : 0;
        this.curScope = newScope;
    }
    exitScope () {
        // iii --;
        // console.log('SCOPE_DEBUG: exitScope', this.curScope?.inJsxTrans, path?.toString(), iii);
        if (this.curScope.inJsxTrans) return;
        const scope = this.curScope;
        // debugger;
        scope.exit();
        // @ts-ignore
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
        if (isJsxCallee(path.node)) {
            // ! 移除 pure 的注释 ! 因为 $mount 属性导致不是纯函数
            const comments = path.node.leadingComments;
            for (let i = comments.length - 1; i >= 0; i--) {
                if (comments[i].value === '#__PURE__') {
                    comments.splice(i, 1);
                }
            }
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
    markVarChange (name: string, fromBind = false) {
        this.curScope.markVariableReactive(name, false, fromBind);
    }

    enterIdentifier (path: NodePath<Identifier>) {
        const { node, parent } = path;
        // @ts-ignore
        if (node._deco) return; // 装饰器jsx直接表达式需要跳过 ! value:number={a}
        const ptype = parent.type;
        // console.log('enterIdentifier', path.parentPath.parentPath.toString(), path.toString());

        if (
            !!NoNeedCollectIdentifierMap[ptype] ||
            (ptype === 'ObjectProperty' && parent.key === node) ||
            // @ts-ignore 非首个member identify 非计算属性
            (isMemberExp(parent) && !parent.computed && !node._firstMember)
        ) {
            return;
        }
        // console.log('enterIdentifier2', path.parentPath.toString(), path.toString(), path.node._fnArg);
        const scope = this.curScope;
        // @ts-ignore
        if (node._fnArg === true) {
            // 函数参数
            // console.log('函数参数: path.parent === scope.node', path.node.name);
            scope.collectParam(path);
        } else {
            // console.log('collectIdentifier 1111', path.toString());
            scope.collectIdentifier(path);
        }

    }
    enterJSXExpression (path: NodePath<Expression>) {
        // debugger;
        this.curScope.enterJSXExpression(path);
    }
    enterJSXExpContainer (path: NodePath<JSXExpressionContainer>) {
        const exp = path.node.expression;
        if (exp.type === 'Identifier') {
            // @ts-ignore
            path.node.expression._skip = true;
            return;
        }
        if (!!NoNeedHandleJsxTypes[exp.type]) {
            return;
        }
        // debugger;
        // @ts-ignore
        path.node.expression._needJsxRefeat = true;
        // debugger;
        // @ts-ignore
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
        // @ts-ignore
        this.mapScope = this.mapScope.exit();
    }
    get inMap () {
        return !!this.mapScope;
    }

    jsxFlagStackDeep = 0;
    checkJsxComponent (path: NodePath<FunctionDeclaration|VariableDeclarator>) {

        if (isComponentFunc(path.node)) {
            // 首字母大写的函数
            // @ts-ignore
            const firstArg = path.node.params[0];
            if (firstArg) {
                if (firstArg.type === 'Identifier') {
                    if (firstArg.name === 'props') {
                        firstArg._isProps = true;
                    }
                } else if (firstArg.type === 'ObjectPattern') {
                    this._parseCompObjectPattern(firstArg.properties);
                }
            }
            this.jsxFlagStackDeep ++;
            // @ts-ignore
            path.node._jsxComp = true;
            return true;
        }
        return false;
    }
    private _parseCompObjectPattern (properties: any[]) {
        properties.forEach(item => {
            getObjectPropValue(item, true)._isReactive = true;
        });
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
    initCurModule(currentModule);
}

export function exitContext () {
    currentModule.exitScope();
    currentModule.exitModule();
    currentModule = currentModule.parent;
    initCurModule(currentModule);
}


