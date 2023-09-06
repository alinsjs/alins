/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-13 12:17:41
 * @Description: Coding something
 */

export interface ICleaner {
    clean(): void;
    collect(key: any, clean: any, force?: boolean): void;
}

let curCleaner: ICleaner|null = null;

export function setCurCleaner (cleaner: ICleaner|null) {
    curCleaner = cleaner;
}

export function getCurCleaner () {
    return curCleaner;
}

export function useCurCleaner<T> (cleaner: ICleaner|null, callback: ()=>T) {
    setCurCleaner(cleaner);
    const result = callback();
    setCurCleaner(null);
    return result;
}

// 收集dom元素依赖的watch，在元素remove时主动释放掉所有watch
export function createCleaner () {

    let set = new WeakSet();
    let cleanMap: any[] = [];

    const cleaner: ICleaner = {
        map () {return cleanMap;},
        clean () {
            cleanMap.forEach(clean => {
                clean();
            });
            // @ts-ignore
            cleanMap = null;
            // @ts-ignore
            set = null;
        },
        collect (key: any, clean: any, force = false) {
            if (!cleanMap) {
                console.warn('cleanMap is null');
                return;
            }
            cleanMap.push(clean);
        }
    };

    curCleaner = cleaner;

    return curCleaner;
}