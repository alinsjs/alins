/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-05 19:36:05
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-06 00:04:46
 */
import {mount, div, comp} from '../alins';

export function initMount () {
    const dom1 = div('dom1');
    const dom2 = div('dom2');
  
    dom1.mount(dom2);
    dom2.mount();
  
    const dom3 = div('dom3');
  
    mount('body', dom3);

    const comp1 = comp(() => {
        return div('comp1');
    });
    const comp2 = comp(() => {
        return div('comp2');
    });

    comp1.mount(comp2);

    comp2.mount();

    div('/button', '我现在变成了一个button').mount();
}

