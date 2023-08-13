/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-13 12:17:41
 * @Description: Coding something
 */

export interface ICleaner {
    clean(): void;
    collect(currentFn: any, clean: any): void;
}

let curCleaner: ICleaner|null = null;

export function setCurCleaner (cleaner: ICleaner|null) {
    curCleaner = cleaner;
}

export function getCurCleaner () {
    return curCleaner;
}

export function useCurCleaner (cleaner: ICleaner|null, callback: ()=>void) {
    setCurCleaner(cleaner);
    callback();
    setCurCleaner(null);
}

// 收集dom元素依赖的watch，在元素remove时主动释放掉所有watch
export function createCleaner () {
    
    let cleanMap: Map<any, ()=>void> = new Map();

    const cleaner: ICleaner = {
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

    curCleaner = cleaner;

    return curCleaner;
}