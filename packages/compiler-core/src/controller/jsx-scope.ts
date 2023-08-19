/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-14 23:19:18
 * @Description: Coding something
 */
import type {NodePath} from '@babel/traverse';
import {createJsxAttr, createMemberExp, getT, Names, parseFirstMemberObject, replaceJsxDomCreator, skipNode} from '../parse-utils';
import type {JSXAttribute, JSXElement, JSXExpressionContainer, JSXFragment} from '@babel/types';
import type {Module} from '../context';
import {isJSXComponent} from '../is';
import {isEventAttr} from '../is';

// ! 此处是因为 jsx 被转译之后无法根据原始path replace
/*
let b = 3;
const dom = <div b={b+1}>{b+1}</div>; // ! 这一步之后结构会变
b = 2; // ! 导致此处变更不能修改之前的结构

JsxScope 是先从最里层遍历的
    */

const ExcludeDecoMap = {class: 1, style: 1};

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
            // @ts-ignore
            nodes.forEach(node => node._removed = true);
            this.jsxNodes = this.jsxNodesStack[this.jsxNodesStack.length - 1];
        }
    }
    exit () {
        this.deep --;
    }
    // ! 收集jsx表达式 // 作用是转换之后就忽略掉转换之前的jsx表示式reactive处理
    collectJsxExp (node: JSXExpressionContainer) {
        // console.log('SCOPE_DEBUG_JSX collectJsxExp', node.type);
        this.jsxNodes.push(node);
    }
    // ! 此处是为了解决 jsx转换是从最里层开始的 而收集jsx表达式是从最外层开始收集的导致 错误的标记了jsx表达式remove状态
    jsxNodesStack: JSXExpressionContainer[][] = [];
    enterJsxElement (path: NodePath<JSXElement|JSXFragment>) {
        const isFrag = path.node.type === 'JSXFragment';
        this.jsxNodes = [];
        this.jsxNodesStack.push(this.jsxNodes);

        // @ts-ignore
        const name = isFrag ? 'FRAG' : path.node.openingElement?.name.name;
        // ! 此处忽略 <A.a> <A:a> 的用法
        this.jsxTagStack.push(name);
        this.curTag = name;
        // @ts-ignore
        this.isJSXComp = isFrag ? false : isJSXComponent(path);
    }
    exitJsxElement () {
        this.jsxTagStack.pop();
        this.curTag = this.jsxTagStack[this.jsxTagStack.length - 1];
    }

    // @ts-ignore
    private curAttr: string;

    private replaceAttr (path: NodePath<JSXAttribute>, name: string, value: any, wrap = false) {
        const t = getT();
        if (typeof value === 'string') {
            value = t.jsxExpressionContainer(t.identifier(value));
        } else if (wrap) {
            value = t.jsxExpressionContainer(value);
        }
        path.replaceWith(createJsxAttr(name, value));
    }

    private parseShortAttr (path: NodePath<JSXAttribute>) {
        const key = path.node.name;
        if (key.type === 'JSXNamespacedName') {
            this.replaceAttr(path, key.namespace.name, key.name.name);
        } else {
            let name = key.name;
            if (name[0] === '$') {
                if (name[1] === '$') {
                    name = name.substring(2);
                    if (name === 'body') {
                        this.replaceAttr(path, '$parent', createMemberExp('document', 'body'), true);
                    } else {
                        this.replaceAttr(path, '$parent', getT().stringLiteral(`#${name}`), true);
                    }
                } else {
                    name = name.substring(1);
                    this.replaceAttr(path, name, name);
                }
            }
        }
    }

    private _pureReg = /(-|^)pure(-|$)/i;

    enterJSXAttribute (path: NodePath<JSXAttribute>) {
        const nodeValue = path.node.value;
        if (!nodeValue) {
            this.parseShortAttr(path);
            return;
        }
        // @ts-ignore
        const expression = nodeValue?.expression;
        if (!expression) return;
        // debugger;
        let name = '';

        let newExpression: any = expression;

        const key = path.node.name;
        const t = getT();

        let deco = '';

        let isEvent = false;
        
        // ! 处理事件包裹
        const checkEventAttr = () => {
            if (isEventAttr(name)) {
                isEvent = true;
                expression._isEventAttr = true;
                // 表示事件是一个函数 不需要包括包裹
                if (!this._pureReg.test(deco) && expression.type !== 'Identifier') {
                    if (!expression?._handled) {
                        newExpression = t.arrowFunctionExpression([], newExpression);
                        newExpression._handled = true;
                    }
                }
            }
        };

        // ! React babel 不支持JSXNamespacedName
        if (key.type === 'JSXNamespacedName') {
            // 利用命名空间做一个语法糖
            name = key.namespace.name;
            if (ExcludeDecoMap[name]) {
                // ! class:a={true} style:color={aa};
                name = `${name}$${key.name.name}`;
                this.replaceAttr(path, name, path.node.value);
            } else {
                expression._deco = true;
                deco = key.name.name;
                checkEventAttr();
                newExpression = t.objectExpression([
                    t.objectProperty(t.identifier('v'), newExpression),
                    t.objectProperty(t.identifier('__deco'), t.stringLiteral(deco))
                ]);
                // 装饰器修饰过的节点不再二次处理
                newExpression._handled = true;
            }

        } else {
            name = key.name;
            checkEventAttr();
        }
        this.curAttr = name;

        // debugger;

        // const name = path.node.name.name as string;
        // this.curAttr = name;

        if (ModelTag[this.curTag]) { // 是输入类型的dom
            if (name === 'value' || (this.curTag === 'input' && name === 'checked')) {
                if (expression) {
                    if (expression.type === 'Identifier') {
                        this.module.markVarChange(expression.name);
                    } else if (expression.type === 'MemberExpression') {
                        const object = parseFirstMemberObject(expression);
                        this.module.markVarChange(object.name);
                        const computedExp = t.callExpression(
                            createMemberExp(Names.CtxFn, Names.ComputedFullFn),
                            [
                                t.arrowFunctionExpression([], expression),
                                t.arrowFunctionExpression([t.identifier('v')], t.assignmentExpression('=', expression, t.identifier('v'))),
                            ]
                        );
                        if (newExpression === expression) {
                            newExpression = computedExp;
                        } else {
                            newExpression.properties[0].value = computedExp;
                        }
                    }
                }
            }
        }


        if (newExpression !== expression) {
            path.replaceWith(
                skipNode(t.jsxAttribute(
                    t.jsxIdentifier(name),
                    t.jsxExpressionContainer(newExpression)
                ), isEvent)
            );
        }
    }
    exitJSXAttribute () {
        this.curAttr = '';
    }

}