/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-05 23:25:08
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-12 09:06:26
 */

import {div, comp, prop} from '../alins';
const Child = ({props}) => {
    return div(`Chidlren ${props.name.value}`);
};

div(
    () => [
        div('数组类型元素'),
        div('数组类型元素')
    ],
    () => {
        console.log('do something');
        return div('逻辑处理');
    },
    () => div('单个元素'),
).mount();

export const CompParent = () => [
    comp(Child)(prop({name: '1'})),
    comp(Child)(prop({name: '2'})),
    div('CompParent children'),
    () => div('22222'),
    () => [
        div('3333'),
        div('44444')
    ],
];