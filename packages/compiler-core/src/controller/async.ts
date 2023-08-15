import type {NodePath} from '@babel/traverse';
import type {FunctionDeclaration} from '@babel/types';

/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-15 07:07:48
 * @Description: Coding something
 */
/**

1. 首先对 AsyncFunction 做Scope，结束时结算
结算规则
1. 函数作用域内 需要有返回jsx的函数才需要处理
2. 函数作用域内 进入 await 时进行标记，直到退出了当前作用

 */
export class AsyncScope {
    fnPath: NodePath<FunctionDeclaration>;
    awaitPath: NodePath<any>;
    parent: AsyncScope|null = null;

    constructor (path: NodePath<FunctionDeclaration>) {
        this.fnPath = path;
    }
}