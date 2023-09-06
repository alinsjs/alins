/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-31 20:37:15
 * @Description: Coding something
 */
import type { NodePath } from '@babel/traverse';
import type { Identifier, JSXAttribute, JSXElement, JSXOpeningElement, Node } from '@babel/types';
import { AlinsVar, ImportManager } from '../controller/import-manager';
import { isOriginJSXElement } from '../is';
import { createCtxCall, getT, parseAttributes } from '../parse-utils';

const CompNames = {
    For: 'For',
    If: 'If',
    ElseIf: 'ElseIf',
    Else: 'Else',
    Switch: 'Switch',
    Case: 'Case',
    Default: 'Default',
    Async: 'Async',
    Show: 'Show',
    // Frag: 'Frag',
};

function wrapChildren (
    children: any[],
    args: any[]|null = [],
    isBreak = true,
) {
    const t = getT();
    let content = (children.length === 1 && isBreak) ? children[0] : t.jsxFragment(
        t.jsxOpeningFragment(),
        t.jsxClosingFragment(),
        children
    );
    if (content.type === 'JSXText') {
        content = t.stringLiteral(content.value);
    }
    if (!args) return content;
    return t.arrowFunctionExpression(args, content);
}

function isEmptyText (node: Node) {
    return node?.type === 'JSXText' && node.value.trim() === '';
}

function createNext (path: NodePath<any>) {
    let index = 0;
    return () => {
        let next;
        do {
            index ++;
            // @ts-ignore
            next = path.getSibling(path.key + index);
        } while (isEmptyText(next.node));
        return next;
    };
}

function getExp (openinigEl: JSXOpeningElement) {
    const attrs = openinigEl.attributes as JSXAttribute[];
    const data = attrs.find(attr => attr.name.name === 'data');
    // @ts-ignore
    if (!data) {
        // @ts-ignore
        const name = openinigEl.name.name;
        if (name === 'Default') return null;
        throw new Error(`${name}: 缺少data属性`);
    }
    // @ts-ignore
    return data.value.expression;
};

function parseFor (path: NodePath<JSXElement>) {
    const attrs = path.node.openingElement.attributes as JSXAttribute[];

    parseComponentAttr(path.node, true);

    let arrId: Identifier|null = null;
    let itemName = '$item';
    let indexName = '$index';

    for (const item of attrs) {
        const name = item.name.name;
        if (name === 'data') {
            // @ts-ignore
            arrId = item.value?.expression;
        } else if (name === 'item') {
            // @ts-ignore
            itemName = item.value?.value;
        } else if (name === 'index') {
            // @ts-ignore
            indexName = item.value?.value;
        }
    }

    if (!arrId) throw new Error('for:data is required');

    const t = getT();

    const children = path.node.children;
    // ! Case中添加其他分支元素时可能已经被转化了 需要用 expContainer 包裹一下
    children.forEach((item, i) => {
        // @ts-ignore
        if (item.type === 'CallExpression') {
            children[i] = t.jsxExpressionContainer(item);
        }
    });

    const newNode = t.callExpression(
        t.memberExpression(
            arrId,
            t.identifier('map'),
        ),
        [
            wrapChildren(children, [
                t.identifier(itemName),
                t.identifier(indexName),
            ])
        ]
    );
    path.replaceWith(newNode);
}

function parseIf (path: NodePath<JSXElement>) {

    let anchor: any = null;

    const t = getT();

    const setAnchor = (
        object: any, id: Identifier, args: any[],
    ) => {
        anchor = t.callExpression(
            id ? t.memberExpression(object, id) : object,
            args
        );
        if (args.length > 0)args[args.length - 1]._call = anchor;
    };

    const nextSibling = createNext(path);


    const endIf = () => {
        setAnchor(anchor, t.identifier('end'), []);
    };

    const handleNext = (path: NodePath<JSXElement>) => {
        let end = false;
        let object: any, id: Identifier|null, args: any[];

        const node = path.node;

        // @ts-ignore
        const name = node.openingElement?.name.name;
        let removed = true;
        switch (name) {
            case CompNames.If: {
                parseComponentAttr(node);
                object = ImportManager.use(AlinsVar.If);
                id = null;
                args = [
                    t.arrowFunctionExpression([], getExp(node.openingElement)),
                    wrapChildren(node.children),
                ];
                removed = false;
            };break;
            case CompNames.ElseIf: {
                parseComponentAttr(node);
                object = anchor;
                id = t.identifier('elif');
                args = [
                    t.arrowFunctionExpression([], getExp(node.openingElement)),
                    wrapChildren(node.children),
                ];
            };break;
            case CompNames.Else: {
                object = anchor;
                id = t.identifier('else');
                args = [ wrapChildren(node.children) ];
                end = true;
            };break;
            default: {
                removed = false;
                end = true;
            };break;
        }
        if (removed) {
            path.remove();
            path.skip();
        }
        if (object) {
            // @ts-ignore
            setAnchor(object, id, args);
            if (!end) {
                const path = nextSibling();
                if (!path.node) {
                    endIf();
                    return;
                }
                handleNext(path);
            } else {
                endIf();
            }
        } else {
            endIf();
        }
    };

    handleNext(path);

    path.replaceWith(anchor);

}

function parseSwitch (path: NodePath<JSXElement>) {

    const node = path.node;
    parseComponentAttr(node);

    const array: any = [];
    const t = getT();

    let childrenList: any[][] = [];
    let isLastBreak = true;

    for (const item of node.children) {
        if (isEmptyText(item)) continue;
        if (!isOriginJSXElement(item.type))  {
            // @ts-ignore
            if (item?.expression.type === 'JSXEmptyExpression') continue;
            throw new Error('switch 中只能包含jsxElement');
        }

        parseComponentAttr(item);
        // @ts-ignore
        const el = item.openingElement;
        // @ts-ignore
        const name = el.name.name;
        if (name === CompNames.Case || name === CompNames.Default) {
            // @ts-ignore
            const brk = el.attributes.find(item => item.name.name === 'break');
            const isBreak = brk?.value?.expression.value !== false;
            // @ts-ignore
            const children = item.children || [];

            const exp = getExp(el);
            const elements: any[] = [
                !exp ? t.nullLiteral() : exp,
                wrapChildren(children, [], isBreak),
                t.booleanLiteral(isBreak),
            ];
            if (!isLastBreak) {
                childrenList.forEach(item => {
                    item.push(...children);
                });
            }
            if (!isBreak) {
                childrenList.push(children);
            } else {
                childrenList = [];
            }
            isLastBreak = isBreak;
            array.push(t.arrayExpression(elements));
            if (name === CompNames.Default) break;
        } else {
            throw new Error('switch 中只能包含case和default');
        }
    }

    const switchNode = createCtxCall(AlinsVar.Switch, [
        t.arrowFunctionExpression([], getExp(node.openingElement)),
        t.arrayExpression(array)
    ]);

    path.replaceWith(t.callExpression(
        t.memberExpression(switchNode, t.identifier('end')),
        []
    ));
}

function parseAsync (path: NodePath<JSXElement>) {
    const node = path.node;
    parseComponentAttr(node);
    const el = node.openingElement;
    const t = getT();
    // @ts-ignore
    const name = el.attributes.find(item => item.name.name === 'name');
    // @ts-ignore
    const dataName = name?.value.value || '$data';
    const body = t.blockStatement([
        t.variableDeclaration(
            'var',
            [ t.variableDeclarator(
                t.identifier(dataName),
                t.awaitExpression(getExp(el))
            ) ]
        ),
        t.returnStatement(wrapChildren(node.children, null))
    ]);

    path.replaceWith(createCtxCall(AlinsVar.Create, [ t.arrowFunctionExpression([], body, true) ]));
}

function parseShow (path: NodePath<JSXElement>) {
    const node = path.node;
    parseComponentAttr(node);

    const exp = getExp(node.openingElement);

    const t = getT();

    const parseChildren = (children: any[]) => {
        children.forEach(item => {
            if (item.type === 'JSXElement') {
                const attrs = item.openingElement.attributes;
                // @ts-ignore
                const show = attrs.find(attr => attr.name.name === '$show') as JSXAttribute;
                if (!show) {
                    attrs.push(t.jsxAttribute(
                        t.jsxIdentifier('$show'),
                        t.jsxExpressionContainer(exp),
                    ));
                } else {
                    if (show.value?.type === 'JSXExpressionContainer') {
                        show.value.expression = exp;
                    } else {
                        show.value = t.jsxExpressionContainer(exp);
                    }
                }
            } else if (item.type === 'JSXExpressionContainer') {
                parseChildren(item.children);
            }
        });
    };
    parseChildren(node.children);

    path.replaceWith(wrapChildren(node.children, null));
}

export function parseInnerComponent (path: NodePath<JSXElement>) {
    const el = path.node.openingElement;
    // @ts-ignore
    const name = el.name?.name;
    switch (name) {
        case CompNames.For: parseFor(path); break;
        case CompNames.If: parseIf(path); break;
        case CompNames.Switch: parseSwitch(path); break;
        case CompNames.Async: parseAsync(path); break;
        case CompNames.Show: parseShow(path); break;
        case CompNames.ElseIf:
        case CompNames.Else:
        case CompNames.Case:
        case CompNames.Default:
            throw new Error(`错误的标签:${name}`);
        default: return false;
    }
    return true;
}

function parseComponentAttr (node: any, handleReactive?: boolean) {
    parseAttributes(node.openingElement.attributes, handleReactive);
}