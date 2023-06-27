/*
 * @Author: tackchen
 * @Date: 2022-10-17 21:58:28
 * @Description: Coding something
 */

import {IJson, IBuilderParameter} from 'alins-utils';

export type IEventFunc = (...args: any[]) => void;

export interface IEvent extends IBuilderParameter {
    type: 'event';
    exe(): IJson<IEventFunc>;
}

export  interface IEventConstructor {
    (prop: IJson<IEventFunc>): IEvent;
}

export const event: IEventConstructor = (event) => {
    return {
        type: 'event',
        exe () {
            return event;
        }
    };
};