/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-05 23:25:08
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-08 09:05:36
 */

import {div, comp, prop} from '../alins';
const Child = ({props}) => {
    return div(`Chidlren ${props.name.value}`);
};
export const CompParent = () => [
    comp(Child, prop({name: '1'})),
    comp(Child, prop({name: '2'})),
];