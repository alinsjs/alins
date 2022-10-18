import {IJson} from '../common';
import {IBuilderParameter} from '../core';
import {TReactionItem} from '../reactive/react';

/*
 * @Author: tackchen
 * @Date: 2022-10-17 21:58:28
 * @Description: Coding something
 */

interface IProps extends IBuilderParameter {
    type: 'props';
    exe(): any;
}

interface IPropsConstructor {
    (props: IJson<TReactionItem>): IProps;
}

export const prop: IPropsConstructor = (props) => {
    
    return {
        type: 'props',
        exe () {
            
        }
    };

};