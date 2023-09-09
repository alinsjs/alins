/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-06 11:35:21
 * @Description: Coding something
 */

import { getT } from '../parse-utils';

export const AlinsStr = {
    Prefix: '_$',
    Value: 'v',
    Temp: '_$R',
    Event: '$e'
};

export enum AlinsVar {
    Create = 'ce',
    MNR = 'mnr',
    React = 'r',
    Computed = 'c',
    Watch = 'w',
    ComputedShort = 'cc', // computed 简写
    Extend = 'e',
    ExtendComp = 'es',
    MarkUpdate = 'mu',
    MockRef = 'mf',
    MockMap = 'mm',
    If = 'if',
    Switch = 'sw',
}

// react | computed | watch | ComputedFull |

export const ImportManager = (() => {
    let used = false;

    const useNames = new Set<AlinsVar>([]);

    let addUse: (name: AlinsVar)=>void = () => {};

    let clear: any;

    return {
        exitModule () {
            if (useNames.size === 0) {
                clear();
            }
            useNames.clear();
            addUse = () => {};
        },
        use (name: AlinsVar) {
            if (!used) used = true;

            const s = `${AlinsStr.Prefix}${name}`;
            if (!useNames.has(name)) {
                // @ts-ignore
                addUse(s);
                useNames.add(name);
            }

            return getT().identifier(s);
        },
        init (useImport: boolean, clearDecl) {
            const t = getT();
            clear = clearDecl;
            if (useImport) {
                const declaration = t.importDeclaration([], t.stringLiteral('alins'));
                addUse = (name: AlinsVar) => {
                    declaration.specifiers.push(
                        t.importSpecifier(t.identifier(name), t.identifier(name))
                    );
                };
                return declaration;
            }
            const objectPattern = t.objectPattern([]);
            const declaration = t.variableDeclaration('var', [
                t.variableDeclarator(objectPattern, t.memberExpression(t.identifier('window'), t.identifier('Alins')))
            ]);
            addUse = (name: AlinsVar) => {
                objectPattern.properties.push(
                    t.objectProperty(t.identifier(name), t.identifier(name), false, true)
                );
            };
            return declaration;
        }
    };
})();