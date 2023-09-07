/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-31 09:38:52
 * @Description: Coding something
 */
import { react } from './react';
import { watch } from './watch';

type IAction<State extends Record<string, any>> =
    Record<string, (this: IStore<State, any, any>, ...args: any[])=>any>
    // Record<string, (this: IStore<State, any, any>, ...args: [...any[], IStore<State, any, any>])=>any>;

type IGetter<State extends Record<string, any>> =
    Record<string, (this: IStore<State, any, any>, store: IStore<State, any, any>)=>any>;

export type IStore<
    State extends Record<string, any>,
    Action = IAction<State>,
    Getter = IGetter<State>,
> = {
    [key in keyof State]: State[key];
} & {
    [key in keyof Action]: Action[key];
} & {
    // @ts-ignore
    [key in keyof Getter]: ReturnType<Getter[key]>;
} & {
    $watch<T extends keyof State>(T: (keyof State), listener: (nv: State[T], ov: State[T])=>void): void;
    $watch<T extends keyof Getter>(T: (keyof Getter), listener: (nv: Getter[T], ov: Getter[T])=>void): void;
    $watch<T>(T: (()=>T), listener: (nv: T, ov: T)=>void): void;
}

let storeId = 0;

const storeMap: Record<string, IStore<Record<string, any>>> = {};

export function getStore<T extends Record<string, any> = any, A = any, G = any> (id: string): IStore<T, A, G>|null {
    // @ts-ignore
    return storeMap[id] || null;
}

export interface IStoreOptions<
    State extends Record<string, any> = Record<string, any>,
    Action = IAction<State>,
    Getter = IGetter<State>,
> {
    id?: string;
    state: ()=>State;
    actions?: Action;
    getters?: Getter;
}
export function createStore<
    State extends Record<string, any>,
    Action = IAction<State>,
    Getter = IGetter<State>,
    Store extends IStore<State, any, any> = IStore<State, Action, Getter>,
> ({
    id,
    state,
    actions,
    getters,
}: IStoreOptions<State, Action, Getter>): () => Store {
    if (!id) id = `store_${storeId++}`;
    return () => {
        let store: Store = storeMap[id!] as Store;
        if (!store) {
            // @ts-ignore
            store = react(state());
            if (actions) {
                for (const k in actions) {
                    // @ts-ignore
                    store[k] = actions[k].bind(store);
                }
            }
            if (getters) {
                for (const k in getters) {
                    Object.defineProperty(store, k, {
                        // @ts-ignore
                        get () {return getters[k].call(store, store);},
                        set () {throw new Error('Cannot set getters');}
                    });
                }
            }
            // @ts-ignore
            storeMap[id] = store;

            store.$watch = (v: any, listener: (v1: any, v2: any) => void) => {
                if (typeof v === 'string') {
                    const prop = v;
                    // @ts-ignore
                    v = () => store[prop];
                }
                return watch(v, listener);
            };
        }
        return store;
    };
}
