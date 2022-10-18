/*
 * @Author: tackchen
 * @Date: 2022-10-17 21:58:28
 * @Description: Coding something
 */

import {IJson} from '../common';
import {IBuilderParameter} from '../core';

export type IEventFunc = (...args: any[]) => void;

export interface IEvent extends IBuilderParameter {
    type: 'event';
    exe(): IJson<IEventFunc>;
}

export  interface IEventConstructor {
    (props: IJson<IEventFunc>): IEvent;
}

export const event: IEventConstructor = (events) => {
    return {
        type: 'event',
        exe () {
            return events;
        }
    };
};