/*
 * @Author: chenzhongsheng
 * @Date: 2023-10-16 09:48:16
 * @Description: Coding something
 */
import type { NodePath } from '@babel/traverse';
import type { ArrayPattern, ObjectPattern, VariableDeclarator } from '@babel/types';


export function parseDeconstruct (path: NodePath<VariableDeclarator>) {
    console.log(path, path.toString());
    const id = path.node.id as ObjectPattern|ArrayPattern;

    const isArray = id.type === 'ArrayPattern';

    // @ts-ignore
    const vars: Node[] = isArray ?
        id.elements.map(n => n?.type === 'RestElement' ? n.argument : n) :
        id.properties.map(n => n.type == 'RestElement' ? n.argument : n.value);


    if (vars.length) {
        console.log(vars);
    }

    // if(id.type)
}