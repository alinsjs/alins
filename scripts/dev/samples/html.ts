/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-03 09:14:51
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-03 09:16:37
 */

import {
    div,  $, input,  html
} from '../alins';

export function htmlComp () {

    const num = $(20);
    return [
        div('html numner:', input.model(num, 'number')),
        div(html($`num=${num}`)),
        div.show(() => num.value > 20)(html($`num=${num}`)),
        div.show(() => num.value > 30)(html('num')),
    ];
}