/*
 * @Author: tackchen
 * @Date: 2022-10-14 07:52:39
 * @Description: Coding something
 */

type TFPMemo = ReturnType<typeof createFuncProcessMemo>

export const Memo : {
    funcProcInstance: TFPMemo | null,
} = {
    funcProcInstance: null,
};

function countALot (a: any): string {
    
}

export const memorizeFuncReturn = () => {
};

export function createFuncProcessMemo<
    F extends (args: any) => any
> () {
    
    let map: Function[] = [];

    let scope: any[] = [];

    const instance = {
        map,
        scope,
        exe (args: any): ReturnType<F> | null {
            scope.length = 0;
            for (let i = 0; i < map.length; i++) {
                scope[i] = map[i](args) as any;
            }
            return scope[scope.length - 1] as ReturnType<F>;
        },
        destory () {
            (map as any) = null;
            Memo.funcProcInstance = null;
            (scope as any) = null;
        }
    };
    Memo.funcProcInstance = instance;
    return instance;
};

// export const