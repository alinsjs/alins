/*
 * @Author: chenzhongsheng
 * @Date: 2022-10-30 02:02:23
 * @Description: Coding something
 */
import {
    div, created, mounted, appended, removed, updated, $,
    input, span,
} from '../alins';

export function Life () {
    const num = $(0);
    return [
        span('修改num:'),
        input.model(num, 'number'),
        div(':test-life', $`.aa-${num}`, created((dom) => {
            console.warn('div created', dom);
        }), mounted((dom) => {
            console.warn('div mounted', dom);
        }), appended((dom) => {
            console.warn('div appended', dom);
        }), removed((dom) => {
            console.warn('div removed', dom);
        }), updated((data) => {
            console.warn('div updated', data);
        })),
        div.switch(num)
            .case(1)($`:case1-${num}`, created((dom) => {
                console.warn('div created1', dom);
            }), mounted((dom) => {
                console.warn('div mounted1', dom);
            }), appended((dom) => {
                console.warn('div appended1', dom);
            }), removed((dom) => {
                console.warn('div removed1', dom);
            }))
            .case(2)($`:case2-${num}`, created((dom) => {
                console.warn('div created2', dom);
            }), mounted((dom) => {
                console.warn('div mounted2', dom);
            }), appended((dom) => {
                console.warn('div appended2', dom);
            }), removed((dom) => {
                console.warn('div removed2', dom);
            }))
    ];
}