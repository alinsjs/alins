/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-05 23:59:45
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-06 00:26:12
 */
import {div, comp, slot} from '../alins';
const Child = ({slots}) => {
    debugger;
    return div('Child', slots);
};
const Parent = () => [
    comp(Child, slot(div('I am a slot'))),
    comp(Child, slot(() => div('I am a function slot'))), // function as slot
];
comp(Parent).mount();