/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:13:50
 * @Description: Coding something
 */

import { ITrueElement } from './element/renderer';

// eslint-disable-next-line no-undef
export interface IReturnCall {
    // @ts-ignore
    (): JSX.Element|null|ITrueElement|void | Promise<JSX.Element|null|ITrueElement|void>;
    returned?: boolean;
}
export type IAsyncReturnCall = () => Promise<ITrueElement|void>;

