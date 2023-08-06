/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 14:29:40
 * @Description: Coding something
 */

import * as Type from '@babel/types';

export type IBabelType = typeof Type;

type INodeTypeMap = {
    [Key in Type.Node['type']]?: 1;
}

// declare module '@babel/types' {
//     interface ImportDeclaration {
//         _importReactive: any;
//     }
// }