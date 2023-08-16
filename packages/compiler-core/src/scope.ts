/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-29 15:17:49
 * @Description: Coding something
 */

import type {NodePath} from '@babel/traverse';
import type {
    Expression,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Node,
    SwitchStatement,
    VariableDeclaration,
    VariableDeclarator,
} from '@babel/types';
import {IfScope} from './controller/if-scope';
import {isNeedComputed, isObjectAssignDeclarator} from './is';
import {JsxScope} from './controller/jsx-scope';
import {isStaticNode, createReact, createComputed, createJsxCompute, createReadValue, Names, createVarDeclarator, createVarDeclaration, createExportAliasInit, getT, skipNode} from './parse-utils';
import {SwitchScope} from './controller/switch-scope';
import {Module} from './context';
import {INodeTypeMap} from './types';
import {FuncReactiveScope} from './controller/func-reactive';

const NodeNeedHandleVarMap: INodeTypeMap = {
    'JSXElement': 1,
    'JSXFragment': 1,
    'ArrowFunctionExpression': 1,
    'FunctionExpression': 1,
};

export interface IScopeVariable {
    type: VariableDeclaration['kind'],
    path: NodePath<VariableDeclarator>,
    name: string,
    isReactive: boolean,
    isFunc?: boolean, // 是否是函数
    isFromImport?: boolean,
    isStatic: boolean,
    isComputed: boolean,
    isParam: boolean, // 是否是函数参数 ! 作用是阻止向上查询变量
    usedIds: NodePath<Identifier>[], // 当前变量的所有引用处
    dependComputed: IScopeVariable[]; // 依赖当前变量的所有计算表达式
    dependJsx: IScopeWatchJSXExpression[]; // 依赖当前变量的所有jsx表达式
    dependTransJsx: IScopeWatchJSXExpression[]; // 依赖当前变量的所有jsxTrans表达式
    dependActions?: (()=>void)[];
    handled: boolean;
    isJSX?: boolean;
    alias?: string;
    isProps?: boolean;
    skipReadV?: boolean;
}

export interface IScopeWatchJSXExpression {
    path: NodePath<Expression>;
    isDynamic: boolean; // 是否依赖了其他响应式数据
    handled: boolean;
    skip: boolean;
    isComp?: boolean;
}

let newNodeId = -1;

// window.s = [];

// 作用域
export class Scope {

    funcScope: FuncReactiveScope;

    parent: Scope|null = null;

    // isFunction = false;
    // isReturnJsx = false;
    node: Node;
    path: NodePath<Node>;

    module: Module;


    // ctx: NodePath<Node>; // ! 当前的 alins ctx 用不到的话需要移除出去

    jsxScope: JsxScope;
    get inJsxTrans () {
        return this.jsxScope.deep > 0;
    }
    enterJsxScope (path: NodePath<any>) {
        // console.log('SCOPE_DEBUG_JSX:enterJsxScope', path.toString());
        this.jsxScope.enter(path);
    }
    exitJsxScope () {
        // console.log('SCOPE_DEBUG_JSX:exitJsxScope', path.toString());
        this.jsxScope.exit();
    }

    id = 0;
    variableMap: {
        // 记录当前作用域的所有的非静态变量声明
        [prop: string]: IScopeVariable;
    } = {
        // @ts-ignore
            __proto__: null,
        };

    reactiveVarMap: {
        // 标记所有需要转化的变量声明
        [prop: string]: any;
    } = {};

    refUseMap: {
        // 标记所有需要加 .value 的ref使用
        [prop: string]: any;
    } = {};

    deep = 0; // 深度

    isFunc = false;

    get isTopScope () {
        return this.deep === 0;
    }

    constructor (path: NodePath<Node>, module: Module, isFunc: boolean) {
        this.isFunc = isFunc;
        this.module = module;
        const node = path.node;
        if (typeof node.start !== 'number') {
            this.id = newNodeId --;
            // throw new Error('Scope.start must be a number');
        } else {
            this.id = node.start;
        }
        this.path = path;
        this.node = node;
        this.jsxScope = new JsxScope(module);
        // @ts-ignore
        if (isFunc && path.node._variable) {
            this.funcScope = new FuncReactiveScope(this, path);
        }
        // window.s.push(this);
        // window.scope ? window.scope.push(this) : window.scope = [ this ];
    }

    // // 解析变量声明 将可能为
    // parseVarDeclaration (d: VariableDeclaration) {
    //     const type = d.kind;
    //     const isConst = type === 'const';
    //     for (const node in d) {

    //     }
    // }


    private curVarNode: IScopeVariable|null = null; // 记录当前变量声明表达式

    private processComputedNode (variable: IScopeVariable) {
        // 找到的变量是自己则不处理
        const dnode = this.curVarNode as IScopeVariable;
        if (!dnode.isComputed) { // 当前处于一个变量声明语句中
            // console.log('variable', node.name, variable.isReactive, variable.isComputed, variable.name);
            if (variable.isReactive) {
                // console.log('isComputed = true2', dnode.name);
                dnode.isReactive = dnode.isComputed = true;
            } else {
                variable.dependComputed.push(dnode);
            }
        }
    }
    endDeclarator () {
        if (!this.curVarNode) return;
        // if (this.curVarNode.name === 'c') debugger;
        if (this.curVarNode.isComputed) {
            this.handleComputed(this.curVarNode);
        }
        this.curVarNode = null;
    }

    collectImportVar (path: NodePath<any>) {
        path.skip();
        // @ts-ignore
        const ir = path.parent._importReactive as string|string[];
        const name = path.node.local.name;
        const reactive = ir !== '' && (ir === '*' || ir.includes(name));
        const variable = this.createVariable('const', name, path);
        variable.isReactive = reactive;
        variable.handled = variable.isFromImport = true;
        this.variableMap[name] = variable;
    }

    collectVar (type: VariableDeclaration['kind'], path: NodePath<VariableDeclarator>) {
        const node = path.node;
        // @ts-ignore
        const name: string = node.id.name;

        // 这种类型不可赋值
        const isStatic = (isStaticNode(node.init as Expression) && type === 'const');

        const variable = this.createVariable(type, name, path);
        variable.isStatic = isStatic;

        if (!isStatic) {
            // @ts-ignore
            const type = path.node.init.type;
            if (type.startsWith('JSX')) variable.isJSX = true;
            this.curVarNode = variable;
        }
        if (node.init?.type === 'ArrowFunctionExpression' || node.init?.type === 'FunctionExpression') {
            variable.isFunc = true;
            // @ts-ignore
            variable.path.node.init._variable = variable;
        }
        // if (name === 'c') debugger;
        this.variableMap[name] = variable;
        // console.log(JSON.stringify(Object.keys(this.variableMap)));
    }

    collectFuncVar (path: NodePath<FunctionDeclaration>) {
        const name = path.node.id?.name;
        if (!name) throw new Error('collectFuncVar, name is undefined');
        const variable = this.createVariable('let', name, path);
        variable.isFunc = true;
        variable.skipReadV = true;
        this.variableMap[name] = variable;
        // @ts-ignore
        variable.path.node._variable = variable;
    }

    private createVariable (
        type: VariableDeclaration['kind'],
        name: string,
        path: any,
    ): IScopeVariable {
        const initType = path.node.init?.type;
        // debugger;
        return {
        // @ts-ignore
            __proto__: null,
            type,
            path,
            name,
            isReactive: false,
            isComputed: false,
            isStatic: false,
            isParam: false,
            usedIds: [],
            dependComputed: [],
            dependJsx: [],
            dependTransJsx: [],
            handled: false,
            skipReadV: !!NodeNeedHandleVarMap[initType],
        };
    }

    // 函数参数
    collectParam (path: NodePath<Identifier>) {
        const node = path.node;
        const variable = this.createVariable('var', node.name, path);
        variable.isParam = true;
        variable.handled = true;

        // @ts-ignore
        if (node._isReactive) {
            variable.isReactive = true;
        // @ts-ignore
        } else if (node._isProps) {
            variable.isReactive = true;
            variable.isProps = true;
        }

        this.variableMap[node.name] = variable;

    }

    // 查找变量
    findVarDeclare (name: string) {
        let parent: Scope = this;
        while (!parent.variableMap[name]) {
            if (!parent.parent) return null;
            parent = parent.parent;
        }
        return parent.variableMap[name];
    }

    private handleComputed (variable: IScopeVariable) {
        if (variable.handled) return;
        if (variable.isJSX) return variable.handled = true;
        // console.trace(variable.name);
        const node = variable.path.node;

        // @ts-ignore
        if (node.init?._isMap) { // ! arr.map 声明变量
            return;
        }

        // ! assign 的数据不需要 computed处理
        if (isObjectAssignDeclarator(node)) {
            return;
        }
        // console.log('createComputed', node.init.type);
        if (isNeedComputed(node)) {
            this.handleExportAlias(variable, createComputed(node));
            variable.isComputed = true;
        } else {
            variable.isComputed = variable.isReactive = false;
        }
    }

    private handleReactive (variable: IScopeVariable) {
        const node = variable.path.node;
        const newNode = variable.isParam ? null : createReact(node);
        this.handleExportAlias(variable, newNode);
    }

    private handleExportAlias (variable: IScopeVariable, newNode: any) {
        const node = variable.path.node;
        // @ts-ignore
        if (node._export) {
            variable.alias = `${Names.AliasPrefix}${variable.name}`;
            // @ts-ignore
            node._parentPath.insertBefore(
                createVarDeclaration(variable.type, [ createVarDeclarator(variable.alias, newNode.init) ])
            );
            if (newNode) {
                newNode.init = createExportAliasInit(variable.alias, variable.name);
                variable.path.replaceWith(newNode);
            }
        } else {
            if (newNode) {
                variable.path.replaceWith(newNode);
            }
        }
        variable.handled = true;
        // if (variable.path.toString() === 'item') {
        //     debugger;
        // }
        variable.isReactive = true;
        this._updateDependIdentifier(variable);
    }

    private handleJsx (xnode: IScopeWatchJSXExpression) {
        if (xnode.handled) return;
        const node = xnode.path.node;
        // ! 如果是react转译之后的JsxCompute 停止后续继续遍历
        // if (!node._needJsxRefeat) {
        xnode.handled = true;
        // 防止重复处理
        // @ts-ignore
        if (!node._handled) {
            xnode.path.replaceWith(createJsxCompute(node, xnode.isComp));
        }
        // }
    }

    // 变量被赋值了 转化变量以及其依赖项
    markVariableReactive (name: string, force = false) {
        const variable = this.findVarDeclare(name);
        if (!variable) {
            return; // console.warn(`markVariableReactive:未找到变量声明${name}`);
        }
        if (variable.handled && !force) return;
        // if (name === 'item') debugger;
        // ! 对于直接赋值的 不需要 handleReactive
        if (variable.path.node._isReplace) return;
        this.handleReactive(variable);

        // console.log(
        //     'markVariableReactive', name,
        //     variable.usedIds.length,
        //     variable.dependComputed.length,
        // );

        // variable.usedIds = variable.dependComputed = variable.dependJsx = [];
    }

    // ! 更新某个变量的所有引用 和 computed依赖
    _updateDependIdentifier (v: IScopeVariable, action = true) {
        // console.log('---_updateDependIdentifier', v.name, v.usedIds.length);
        v.usedIds.forEach((path) => {
            this._replaceReadValuePath(path, v);
        });
        v.dependComputed.forEach((cnode) => {
            this.handleComputed(cnode);
        });
        if (action) v.dependActions?.forEach(fn => fn());
        // ! jsx 已经被转译之后不再需要对原始对象进行更新
        // debugger;
        v.dependTransJsx.forEach((xnode) => {
            this.handleJsx(xnode);
        });
        v.dependJsx.forEach((xnode) => {
            // debugger;
        // @ts-ignore
            if (!xnode.path.node._removed) {
                this.handleJsx(xnode);
            }
        });
    }

    collectDependAction (name: string, fn: ()=>void) {
        const variable = this.findVarDeclare(name);
        if (!variable) return false;
        if (variable.isReactive) {
            fn();
        } else {
            if (!variable.dependActions) variable.dependActions = [];
            variable.dependActions.push(fn);
        }
        return true;
    }

    collectIdentifier (path: NodePath<Identifier>) {
        // console.log('---collectIdentifier', path.node.name);
        const node = path.node;
        // @ts-ignore
        if (typeof node.start !== 'undefined' && path.parent.id === node.start) {
            // debugger;
            return;
        }

        // ! 找到当前标识的变量
        // @ts-ignore
        const variable = this.findVarDeclare(node.name);
        // console.log('collectIdentifier222', this.module.inMap, path.node.name, variable?.name);

        // if (variable?.path.node.name === 'a') debugger;
        if (!variable) {
            // debugger;
            // return console.warn(`未找到变量声明${node.name}`);
            return;
        }

        if (variable.path.node.start === node.start) return;
        // console.log(variable.path.getNextSibling().toString(), variable.path.toString());
        // console.log('collectIdentifier', variable.name, variable.isComputed, node.name);
        // // todo 这里map会无线循环函数参数
        // debugger;

        // if (variable.name === 'a') {
        //     debugger;
        // }
        // debugger;
        // console.log('FOR_DEBUG collectIdentifier', variable.path.toString(), this.currentJSXExpression);
        if (this.currentJSXExpression) {
            this.processJSXNode(variable);
        } else if (this.curVarNode) {
            this.processComputedNode(variable);
        }
        this.funcScope?.collectIdentifier(variable);
        // if (variable.name === 'fn2') debugger;
        // console.log('---variable.isReactive', variable.isReactive, variable.name, path.toString());
        if (variable.isReactive) { //
            this._replaceReadValuePath(path, variable);
            return;
        } else {
            variable.usedIds.push(path);
        }
    }

    private _replaceReadValuePath (path: NodePath, variable: IScopeVariable) {
        // console.log('---_replaceReadValuePath', variable.skipReadV);
        if (variable.skipReadV) return;
        if (variable.isProps) {
            // @ts-ignore
            const sp = path.node._secondPath;
            const t = getT();
            sp.replaceWith(skipNode(t.memberExpression(
                sp.node,
                t.identifier(Names.Value)
            )));
        } else {
            // @ts-ignore
            if (!path.node._isReplace) {
                path.replaceWith(createReadValue(variable.alias || variable.name));
            }
        }
    }

    markMapVariable (keyName: string, indexName: string) {
        this.markVariableReactive(keyName, true);
        this.markVariableReactive(indexName, true);
    }

    private currentJSXExpression: IScopeWatchJSXExpression|null = null;
    processJSXNode (v: IScopeVariable) {
        const xnode = this.currentJSXExpression as IScopeWatchJSXExpression;
        // console.log(xnode.path.toString(),
        //     v.path.toString(), xnode.isDynamic, v.isReactive);

        if (!xnode.isDynamic) {
            if (v.isReactive) {
                xnode.isDynamic = true;
            } else {
                // if (v.name === 'index') debugger;
                (this.inJsxTrans ? v.dependTransJsx : v.dependJsx).push(xnode);
            }
        }
    }
    enterJSXExpression (path: NodePath<Expression>) {
        // console.log(path.toString());
        // debugger;
        const exp = {
            __proto__: null,
            path,
            isDynamic: false,
            handled: false,
            skip: false,
            isComp: this.jsxScope.isJSXComp,
        };
        // @ts-ignore
        path.node._jsxExp = exp;
        this.currentJSXExpression = exp;
    }
    exitJSXExpression () {
        const xnode = this.currentJSXExpression as IScopeWatchJSXExpression;
        if (!this.currentJSXExpression) return;
        // debugger;
        if (this.currentJSXExpression.skip) {
            this.currentJSXExpression = null;
            return;
        }
        // console.log('FOR_DEBUG', xnode.path.toString());
        if (xnode.isDynamic) {
            this.handleJsx(xnode);
        } else {
            // debugger;
        }
        this.currentJSXExpression = null;
    }

    // if Scope
    ifScope: IfScope|null = null;
    enterIfScope (path: NodePath<IfStatement>) {
        // @ts-ignore
        if (path.node._traversed) return;
        const newScope = new IfScope(path, this);
        if (this.ifScope) {
            newScope.parent = this.ifScope;
        }
        // @ts-ignore
        if (!newScope.ended) {
            // Program 和 Function 节点 body层次不一样
        // @ts-ignore
            let body = this.path.node.body;
            if (!Array.isArray(body)) body = body.body;
            // 当前if节点的index
            const index = body.indexOf(path.node);
            // const nodes = this.path.node.body.slice(index + 1);
            // ! 使用unshift可以保证从后面先开始收入end
            this.onExitQueue.unshift(() => {
                // 将if之后的节点全部放到end中
                const nodes = body.splice(index + 1);
                newScope?.replaceEnd(nodes);
            });
        }
        this.ifScope = newScope;
        Scope.ifScopeDeep ++;
    }
    exitIfScope (path: NodePath<IfStatement>) {
        if (!this.ifScope) return;
        // @ts-ignore
        if (path.node._traversed && path !== this.ifScope.path) return;
        this.ifScope = this.ifScope.exit();
        Scope.ifScopeDeep --;
    }
    get inIf () {
        return !!this.ifScope || Scope.ifScopeDeep > 0;
    }

    static switchScopeDeep = 0;
    static ifScopeDeep = 0;

    // switch scope
    switchScope: SwitchScope|null = null;
    enterSwitchScope (path: NodePath<SwitchStatement>) {
        // debugger;
        const newScope = new SwitchScope(path, this);
        if (this.switchScope) {
            newScope.parent = this.switchScope;
        }
        // @ts-ignore
        if (!newScope.ended) {
            // 当前if节点的index
        // @ts-ignore
            let body = this.path.node.body;
            if (!Array.isArray(body)) body = body.body;
            const index = body.indexOf(path.node);
            // const nodes = this.path.node.body.slice(index + 1);
            // ! 使用unshift可以保证从后面先开始收入end
            this.onExitQueue.unshift(() => {
                // 将if之后的节点全部放到end中
                const nodes = body.splice(index + 1);
                newScope?.replaceEnd(nodes);
            });
        }
        this.switchScope = newScope;
        Scope.switchScopeDeep ++;
    }
    exitSwitchScope (path: NodePath<SwitchStatement>) {
        // debugger;
        if (!this.switchScope) return;
        if (path !== this.switchScope.path) return;
        this.switchScope = this.switchScope.exit();
        Scope.switchScopeDeep --;
    }
    get inSwitch () {
        return !!this.switchScope || Scope.switchScopeDeep > 0;
    }


    private onExitQueue: (()=>void)[] = [];
    exit () {
        this.onExitQueue.forEach(fn => {fn();});
        // @ts-ignore
        this.onExitQueue = null;
    }

    isAsync = false;
    awaitRecorded = false;
    startRecordAwait () {
        this.awaitRecorded = false;
    }
    collectAwait () {
        if (!this.isAsync) this.isAsync = true;
        if (!this.awaitRecorded) this.awaitRecorded = true;
        // debugger;
        // @ts-ignore
        this.node._setAsync?.(); // ! 设置block元素方法为async
    }
}