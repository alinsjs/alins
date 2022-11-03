/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:41:40
 * @Description: Coding something
 */
export interface IJson<T = any> {
    [prop: string | symbol]: T;
}

export interface IBuilderParameter {
    exe: Function;
    type: 'style' | 'pseudo' |
        'text' | 'selector' | 'children' |
        'comp' | 'react' | 'builder' |
        // 控制器 没有for
        'for' | 'if' | 'show' | 'model' | 'switch' |
        'on' |
        // 组件
        'event' | 'prop' | 'slot' | 'life' | 'html';
}