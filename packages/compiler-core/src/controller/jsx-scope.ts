/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-14 23:19:18
 * @Description: Coding something
 */
import type {NodePath} from '@babel/traverse';
import {getT, replaceJsxDomCreator} from '../parse-utils';
import type {JSXAttribute, JSXElement, JSXExpressionContainer, JSXFragment} from '@babel/types';
import type {Module} from '../context';
import {isJSXComponent} from '../is';

// ! 此处是因为 jsx 被转译之后无法根据原始path replace
/*
let b = 3;
const dom = <div b={b+1}>{b+1}</div>; // ! 这一步之后结构会变
b = 2; // ! 导致此处变更不能修改之前的结构

JsxScope 是先从最里层遍历的
    */

const ModelTag = {
    input: 1, select: 1, textarea: 1,
};

export class JsxScope {

    jsxTagStack: string[] = [];

    curTag: string;
    isJSXComp = false;

    deep = 0;
    module: Module;

    constructor (module: Module) {
        this.module = module;
    }

    private jsxNodes: JSXExpressionContainer[] = [];
    get inJsxTrans () { // ! 处于jsx转换之后的
        return this.deep > 0;
    }
    enter (path: NodePath<any>) {
        // console.warn(`Enter JSX Scope: ${path.node.type}-${path.toString()}`, path.node.object);
        path.replaceWith(replaceJsxDomCreator(path));
        path.node._jsxScope = true; // 先替换再赋值
        this.deep ++;

        const nodes = this.jsxNodesStack.pop();

        if (nodes?.length) {
            // ! 将该jsx方法对应的jsx表达式全部标记为removed
            // 作用是转换之后就忽略掉转换之前的jsx表示式reactive处理
            nodes.forEach(node => node._removed = true);
            this.jsxNodes = this.jsxNodesStack[this.jsxNodesStack.length - 1];
        }
    }
    exit () {
        this.deep --;
    }
    // ! 收集jsx表达式 // 作用是转换之后就忽略掉转换之前的jsx表示式reactive处理
    collectJsxExp (node: JSXExpressionContainer) {
        console.log('SCOPE_DEBUG_JSX collectJsxExp', node.type);
        this.jsxNodes.push(node);
    }
    // ! 此处是为了解决 jsx转换是从最里层开始的 而收集jsx表达式是从最外层开始收集的导致 错误的标记了jsx表达式remove状态
    jsxNodesStack: JSXExpressionContainer[][] = [];
    enterJsxElement (path: NodePath<JSXElement|JSXFragment>) {
        const isFrag = path.node.type === 'JSXFragment';
        this.jsxNodes = [];
        this.jsxNodesStack.push(this.jsxNodes);

        const name = isFrag ? 'FRAG' : path.node.openingElement?.name.name;
        // ! 此处忽略 <A.a> <A:a> 的用法
        this.jsxTagStack.push(name);
        this.curTag = name;
        this.isJSXComp = isFrag ? false : isJSXComponent(path);
    }
    exitJsxElement () {
        this.jsxTagStack.pop();
        this.curTag = this.jsxTagStack[this.jsxTagStack.length - 1];
    }

    private curAttr: string;

    enterJSXAttribute (path: NodePath<JSXAttribute>) {
        // debugger;
        // ! React babel 不支持JSXNamespacedName
        const key = path.node.name;
        let name = '';
        const expression = path.node.value.expression;
        if (key.type === 'JSXNamespacedName') {
            // 利用命名空间做一个语法糖
            name = key.namespace.name;
            const t = getT();
            // path.insertAfter(
            //     skipNode(t.jsxAttribute(t.jsxIdentifier(`$${name}_${key.name.name}`)))
            // );

            expression._deco = true;

            const decoNode = t.objectExpression([
                t.objectProperty(t.identifier('v'), expression),
                t.objectProperty(t.identifier('__deco'), t.stringLiteral(key.name.name))
            ]);

            path.replaceWith(t.jsxAttribute(
                t.jsxIdentifier(name),
                t.jsxExpressionContainer(decoNode)
            ));
        } else {
            name = key.name;
        }
        this.curAttr = name;

        // debugger;

        // const name = path.node.name.name as string;
        // this.curAttr = name;

        if (ModelTag[this.curTag]) { // 是输入类型的dom
            if (name === 'value' || (this.curTag === 'input' && name === 'checked')) {
                // const express = path.node.value?.expression;
                if (expression?.type === 'Identifier') {
                    this.module.markVarChange(expression.name);
                }
            }
        }
    }
    exitJSXAttribute () {
        this.curAttr = '';
    }

}