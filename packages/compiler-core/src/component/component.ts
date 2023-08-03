/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-31 20:37:15
 * @Description: Coding something
 */
import type {NodePath} from '@babel/traverse';
import type {Identifier, JSXAttribute, JSXElement, JSXOpeningElement, Node} from '@babel/types';
import {getT, Names} from '../parse-utils';

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
};

function wrapChildren (children: any[], args: any[]|null = []) {
    const t = getT();
    let content = children.length === 1 ? children[0] : t.jsxFragment(
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
            next = path.getSibling(path.key + index);
        } while (isEmptyText(next.node));
        return next;
    };
}

function getExp (openinigEl: JSXOpeningElement) {
    const attrs = openinigEl.attributes as JSXAttribute[];
    const data = attrs.find(attr => attr.name.name === 'data');
    if (!data) throw new Error(`${openinigEl.name.name}: 缺少data属性`);
    return data.value.expression;
};

function parseFor (path: NodePath<JSXElement>) {
    const attrs = path.node.openingElement.attributes as JSXAttribute[];

    let arrId: Identifier|null = null;
    let itemName = '$item';
    let indexName = '$index';

    for (const item of attrs) {
        const name = item.name.name;
        if (name === 'data') {
            arrId = item.value?.expression;
        } else if (name === 'item') {
            itemName = item.value?.value;
        } else if (name === 'index') {
            indexName = item.value?.value;
        }
    }

    if (!arrId) throw new Error('for:data is required');

    const t = getT();
    const newNode = t.callExpression(
        t.memberExpression(
            arrId,
            t.identifier('map'),
        ),
        [
            wrapChildren(path.node.children, [
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
            t.memberExpression(object, id),
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
        let object: any, id: Identifier, args: any[];

        const node = path.node;

        const name = node.openingElement?.name.name;
        let removed = true;
        switch (name) {
            case CompNames.If: {
                object = t.identifier(Names.Ctx);
                id = t.identifier('if');
                args = [
                    t.arrowFunctionExpression([], getExp(node.openingElement)),
                    wrapChildren(node.children),
                ];
                removed = false;
            };break;
            case CompNames.ElseIf: {
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
            setAnchor(object, id, args);
            if (!end) {
                const path = nextSibling();
                console.log(path?.toString?.());
                debugger;
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

    const array: any = [];
    const t = getT();

    for (const item of node.children) {
        if (isEmptyText(item)) continue;
        if (item.type !== 'JSXElement') throw new Error('switch 中只能包含jsxElement');
        const el = item.openingElement;
        const name = el.name.name;
        if (name === CompNames.Case || name === CompNames.Default) {
            const properties: any[] = [];
            properties.push(t.objectProperty(
                t.identifier('c'),
                wrapChildren(item.children)
            ));
            if (name === CompNames.Case) {
                properties.push(t.objectProperty(
                    t.identifier('v'),
                    getExp(el)
                ));
            }
            const brk = !!el.attributes.find(item => item.name.name === 'break');
            if (brk)
                properties.push(t.objectProperty(
                    t.identifier('b'),
                    t.booleanLiteral(true)
                ));
            array.push(t.objectExpression(properties));
            if (name === CompNames.Default) break;
        } else {
            throw new Error('switch 中只能包含case和default');
        }
    }


    const switchNode = t.callExpression(
        t.memberExpression(t.identifier(Names.Ctx), t.identifier('switch')),
        [
            t.arrowFunctionExpression([], getExp(node.openingElement)),
            t.arrayExpression(array)
        ]
    );

    path.replaceWith(t.callExpression(
        t.memberExpression(switchNode, t.identifier('end')),
        []
    ));
}

function parseAsync (path: NodePath<JSXElement>) {
    const node = path.node;
    const el = node.openingElement;
    const t = getT();
    const name = el.attributes.find(item => item.name.name === 'name');
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

    path.replaceWith(t.callExpression(
        t.memberExpression(t.identifier(Names.CtxFn), t.identifier('ce')),
        [
            t.arrowFunctionExpression([], body, true)
        ]
    ));
}

function parseShow (path: NodePath<JSXElement>) {
    const node = path.node;

    const exp = getExp(node.openingElement);

    const t = getT();
    node.children.forEach(item => {
        if (item.type === 'JSXElement') {
            const attrs = item.openingElement.attributes;
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
        }
    });

    path.replaceWith(wrapChildren(node.children, null));
}

export function parseInnerComponent (path: NodePath<JSXElement>) {
    const el = path.node.openingElement;
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