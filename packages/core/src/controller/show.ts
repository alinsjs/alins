/*
 * @Author: tackchen
 * @Date: 2022-10-15 19:53:12
 * @Description: Coding something
 */
/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {subscribe, transformToReaction} from 'alins-reactive';
import {IMountBuilderParameter} from '../element/transform';
import {TIfArg} from './if';
import {getControllerDoms, IControllerConstructor, IControllerDom, parseHTMLElement, TControllerArg, TControllerType} from './controller';
import {mountParentWithTChild} from '../mount';
export interface IShowBuilder extends IMountBuilderParameter {
    exe(): IControllerDom;
    type: 'show';
}

export interface IShowController<K extends TControllerType = 'builder'> {
    (
        this: IControllerConstructor,
        bool: TIfArg,
    ): ((...args: TControllerArg<K>) => IShowBuilder);
}

// div.if(num.value > 1)(react`:${bool}`),
// div.if(bool)(react`:${num.value}`),

function setDisplay (children: DocumentFragment | HTMLElement | HTMLElement[], v: boolean) {
    const s = v ? '' : 'none';
    if (children instanceof DocumentFragment) {
        children = [].slice.call(children);
    }
    children instanceof Array ?
        children.forEach(item => {item.style.display = s;}) :
        (children as HTMLElement).style.display = s;
}

export const showController: IShowController<any> = function (this: IControllerConstructor, bool) {
    
    const react = transformToReaction<boolean>(bool);
    const constructor = this;

    return (...args) => {
        return {
            exe () {
                const builder = constructor.apply(null, args);
                const {children} = getControllerDoms(builder);
                const v = react[subscribe](v => {
                    setDisplay(children, v);
                });
                const result = parseHTMLElement(children);
                setDisplay(result as any, v);
                return result;
            },
            type: 'show',
            mount (parent = 'body') {
                mountParentWithTChild(parent, this);
            }
        };
    };
};