/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-13 12:17:41
 * @Description: Coding something
 */

export interface ICleanner {
    clean(): void;
    collect(currentFn: any, clean: any): void;
}

let curCleanner: ICleanner|null = null;

export function setCurCleanner (cleanner: ICleanner|null) {
    curCleanner = cleanner;
}

export function getCurCleanner () {
    return curCleanner;
}

export function useCurCleanner (cleanner: ICleanner|null, callback: ()=>void) {
    setCurCleanner(cleanner);
    callback();
    setCurCleanner(null);
}

// 收集dom元素依赖的watch，在元素remove时主动释放掉所有watch
export function createCleanner () {
    
    let cleanMap: Map<any, ()=>void> = new Map();

    const cleanner: ICleanner = {
        clean () {
            const keys = cleanMap.keys();
            for (const key of keys) {
                // @ts-ignore
                cleanMap.get(key)();
            }
            cleanMap.clear();
            // @ts-ignore
            cleanMap = null;
        },
        collect (key: any, clean: any) {
            if (cleanMap.has(key)) return;
            cleanMap.set(key, clean);
        }
    };

    curCleanner = cleanner;

    return curCleanner;
}