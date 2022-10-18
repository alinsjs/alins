/*
 * @Author: tackchen
 * @Date: 2022-10-10 17:41:14
 * @Description: Coding something
 */


export interface IBuilderParameter {
    exe: Function;
    type: 'style' |
        'text' | 'selector' | 'children' |
        'comp' | 'react' | 'builder' |
        // 控制器 没有for
        'if' | 'show' | 'model' | 'switch' |
        'on' |
        // 组件
        'event' | 'prop' | 'slot';
}