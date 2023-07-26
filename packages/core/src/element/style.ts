/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import {reactiveBindingEnable} from "./dom-util";
import {IStyle} from "./jsx";

export function parseStyle(
    dom: HTMLElement,
    value: IStyle | string | (()=>string)
): boolean{
    if(typeof value !== 'object'){
        return false;
    }

    for(let k in value){
        // !todo style value 编译 + func包裹 ()=>{}
        reactiveBindingEnable(value[k], (v, ov) => {
            dom.style[k] = v === null ? '': v;
        });
    }

    return true;
}