/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-05 23:59:45
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-06 10:48:18
 */
import {div, comp, slot} from '../alins';
const Child = ({slots}) => {
    return div('Child', slots);
};
const Parent = () => [
    comp(Child, slot(div('I am a slot'))),
    comp(Child, slot(() => div('I am a function slot'))), // function as slot
];
comp(Parent).mount();


const Child2 = ({slots}) => div('Child', slots.slotA, slots.slotB);
const Parent2 = () => [
    comp(Child2, slot({
        slotA: div('I am a slot'),
        slotB: () => div('I am a function slot'),
    })),
];
comp(Parent2).mount();