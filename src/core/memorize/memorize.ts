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

    const instance = {
        add (fn: Function) {
            map.push(fn);
        },

        exe (...args: Parameters<F>): ReturnType<F> {
            console.log(args);
            let result = args as any;
            for (let i = 0; i < map.length; i++) {
                result = map[i](...args) as any;
            }
            return result as ReturnType<F>;
        },

        destory () {
            (map as any) = null;
            Memo.funcProcInstance = null;
        }
    };
    Memo.funcProcInstance = instance;
    return instance;
};

// export const