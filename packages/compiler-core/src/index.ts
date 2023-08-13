/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 14:11:47
 * @Description: Coding something
 */
export interface IParserOptions {
    useImport?: boolean;
    ts?: boolean;
    filename?: string;
}

export function randomTsxFileName () {
    return `${Math.random().toString(16).substring(2)}.tsx`;
}

export type IAlinsParser = (code: string, options?: IParserOptions) => string;

export {createNodeVisitor, createBabelPluginAlins} from './transform';

// import type {Node} from '@babel/traverse';

// import * as A from '@babel/types';

// export const a: Node = {} as any;

// export default A;