/*
 * @Author: tackchen
 * @Date: 2022-10-14 07:52:39
 * @Description: Coding something
 */

export type TFPMemo = ReturnType<typeof createFuncProcessMemo>

export const memorizeFuncReturn = () => {
};

export function createFuncProcessMemo<
    F extends (args: any) => any
> () {
    
    let map: Function[] = [];

    let scope: any[] = [];

    let instance = {
        add (fn: Function) {
            map.push(fn);
        },
        scope (i: number) {return scope[i];},
        last: null as any,
        exe (args: any): ReturnType<F> | null {
            if (map.length === 0) return null;
            scope.length = 0;
            for (let i = 0; i < map.length; i++) {
                const result = map[i](args) as any;
                scope[i] = result;
                this.last = result;
            }
            return scope[scope.length - 1] as ReturnType<F>;
        },
        destory () {
            (map as any) = null;
            (scope as any) = null;
            (instance as any) = null;
        }
    };

    return instance;
};

// export const