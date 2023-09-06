/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-17 07:55:32
 * @Description: Coding something
 */
import type { Statement } from '@babel/types';
import type { NodePath } from '@babel/traverse';
import type { Scope } from '../scope';

export abstract class ControlScope<NodeType> {
    replaceEnd: (node: Statement[])=>void;
    parent: ControlScope<NodeType>|null = null; ;
    path: NodePath<NodeType>;
    newNode: any;
    top = false;

    isReturnJsx = false;
    markScopeReturnJsx () {
        this.isReturnJsx = true;
        this.parent?.markScopeReturnJsx();
    }

    // todo 根据 if test 中是否是响应数据来决定是否需要 replace if 暂时先全部replace处理
    // isReactive = true;

    // // ! 标识当前if块是否一定会返回值
    // returned = true;

    parentScope: Scope;

    recordAwait = true;

    constructor (path: NodePath<NodeType>, scope: Scope) {
        this.path = path;
        this.parentScope = scope;
        this.top = scope.isTopScope;
        this._init();
    }
    abstract _init (): void;

    exit () {
        // 记录end是否是async
        // console.log('recordAwait', this.recordAwait);
        if (this.recordAwait) {
            this.parentScope.startRecordAwait();
        }

        // ! 此处可以配合reactive决定是否需要立即replace
        /*
        如果当前if中没有reactive条件 可以全局维护一个replace队列
        在 Program.exit 统一replace
        if(this.reactive){
            this.path.replaceWith(this.newNode);
        }else{
            globalQueue.push(()=>{
                if(this.reactive){ // ! 遍历过程中记录是否有reactive数据
                    this.path.replaceWith(this.newNode);
                }
            })
        }
        */
        if (this.newNode && this.isReturnJsx) {
            this.path.replaceWith(this.newNode);
            // @ts-ignore
            this.newNode = null;
        }

        return this.parent;
    }
}