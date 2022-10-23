/*
 * @Author: tackchen
 * @Date: 2022-07-11 17:17:54
 * @Description: Coding something
 */

import {mount, div, comp} from './alins';
import {Count} from './samples/count';

mount(
    div('Hello World'),
    div('Count------------------'),
    comp(Count),
    div('Count------------------'),
    comp(Count),
    div('Count------------------'),
    comp(Count),
    div('Count------------------'),
    comp(Count),
);