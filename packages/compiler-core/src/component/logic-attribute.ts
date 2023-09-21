import type { NodePath } from '@babel/traverse';
import type { JSXAttribute, JSXElement } from '@babel/types';
import { findAttributes, getT } from '../parse-utils';
import { isMountAttr } from '../is';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-20 15:14:59
 * @Description: Coding something
 */
export function checkLogicAttribute (path: NodePath<JSXElement>) {
    const attrs = path.node.openingElement?.attributes;

    if (!attrs) return false;

    let res: boolean|'if'|'switch' = false;

    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier') {
            const name = attr.name.name;

            switch (name) {
                case '$if': transformIfAttr(path, attr); res = 'if'; break;
                case '$switch': transformSwitchAttr(path, attr); res = true; break;
                case '$for': transformCommonNode(path, attr, 'For', [ '$item', '$index' ]); res = true; break;
                case '$async': transformCommonNode(path, attr, 'Async', [ '$name' ]); res = true; break;

                case '$elseif':
                case '$else':
                case '$case':
                case '$default':
                    throw new Error(`${name} 不能单独使用`);
            }
        }
    }

    return res;
}

function transformIfAttr (
    path: NodePath<JSXElement>,
    attr: JSXAttribute,
) {

    const taskList: any[] = [];

    const runTasks = () => {taskList.forEach(task => {task();});};

    const newNode = transformCommonNode(path, attr, 'If');
    taskList.push(() => { path.replaceWith(newNode); });

    let next: any = path;


    for (;;) {
        next = next.getNextSibling();
        if (!next.node || (next.type === 'JSXText' && !!next.node.value.trim())) {
            break;
        }
        if (next.type === 'JSXElement') {
            const tagName = next.node?.openingElement?.name.name;
            if (tagName === 'ElseIf') {
                continue;
            } else if (tagName === 'Else') {
                break;
            } else {
                const res = findAttributes(next.node, name => name === '$elseif' || name === '$else');
                if (!res) break;
                const isElse = res.name.name === '$else';
                const temp = next;
                const newNode = transformCommonNode(temp, res, isElse ? 'Else' : 'ElseIf');
                taskList.push(() => { temp.replaceWith(newNode); });
                if (isElse) break;
                else continue;
            }
        }
    }
    return runTasks();
}

function createJSXElement (name: string, attrs: [string, any][], node: any) {
    const t = getT();
    return t.jsxElement(
        t.jsxOpeningElement(
            t.jsxIdentifier(name),
            attrs.map(item => t.jsxAttribute(t.jsxIdentifier(item[0]), item[1]))
        ),
        t.jsxClosingElement(t.jsxIdentifier(name)),
        Array.isArray(node) ? node : [ node ]
    );
}

function transformSwitchAttr (
    path: NodePath<JSXElement>,
    attr: JSXAttribute
) {
    if (findAttributes(path.node, isMountAttr)) {
        throwNoMount('$switch');
    }
    const children = path.node.children;

    transformSwitchChildren(children);

    path.node.children = [
        createJSXElement('Switch', [ [ 'data', attr.value ] ], children)
    ];
    const attrs = path.node.openingElement?.attributes;

    attrs.splice(attrs.indexOf(attr), 1);
}

export function transformSwitchChildren (
    children: any[]
) {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        const attrs = child.openingElement?.attributes;

        if (!attrs) continue;

        for (let j = 0; j < attrs.length; j++) {
            const attr = attrs[j];
            if (attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier') {
                const name = attr.name.name;
                const isCase = name === '$case';
                if (isCase || name === '$default') {

                    if (findAttributes(child, isMountAttr)) {
                        throwNoMount(name);
                    }
                    attrs.splice(j, 1);

                    const newAttrs: any[] = [];

                    if (isCase) {
                        newAttrs.push([ 'data', attr.value ]);
                        const brk = findAttributes(child, '$break');
                        if (brk) {
                            // @ts-ignore
                            newAttrs.push([ 'break', brk.value ]);
                            attrs.splice(attrs.indexOf(brk), 1);
                        }
                    }
                    const newNode = createJSXElement(
                        isCase ? 'Case' : 'Default',
                        newAttrs,
                        child
                    );
                    children[i] = newNode;
                    return children;
                }
            }
        }
    }
    return children;
}

function transformCommonNode (
    path: NodePath<JSXElement>,
    attr: JSXAttribute,
    tagName: string,
    attrMatchArr: string[] = [],
    replace = true,
) {
    const node = path.node;
    const attrs = node.openingElement?.attributes;
    attrs.splice(attrs.indexOf(attr), 1);

    const newAttrs: any[] = [ [ 'data', attr.value ] ];
    for (let i = attrs.length - 1; i >= 0; i--) {
        const item = attrs[i];
        if (item.type === 'JSXAttribute' && item.name.type === 'JSXIdentifier') {
            const name = item.name.name;
            if (attrMatchArr.includes(name)) {
                newAttrs.push([ name.substring(1), item.value ]);
                attrs.splice(i, 1);
            } else if (isMountAttr(name)) {
                throwNoMount(`$${tagName.toLowerCase()}`);
            }
        }

    }
    const newNode = createJSXElement(
        tagName,
        newAttrs,
        node
    );
    if (replace) path.replaceWith(newNode);
    return newNode;
}


function throwNoMount (name: string) {
    throw new Error(`${name} 属性元素不支持使用 $mount属性`);
}