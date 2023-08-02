/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:54:25
 * @Description: Coding something
 */
export function join (array: string[], fn: string[] | ((index: number)=>string)) {
    let str = '';
    for (let i = 0; i < array.length - 1; i++) {
        str += `${array[i]}${typeof fn === 'function' ? fn(i) : fn[i]}`;
    }
    return str + array[array.length - 1];
}

export function delay (time = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

const FuncArgExp = /\(.*?\)/;
export function getFuncArgs (fn: Function) {
    return fn.toString().match(FuncArgExp)?.[0] || '';
}

export function isStringTemplateArray (data: any) {
    return data instanceof Array && (data as any).raw instanceof Array;
}

export function isObject (data: any) {
    return data && typeof data === 'object';
}

export function splitTwoPart (str: string, sep: string) {
    const index = str.indexOf(sep);
    if (index === -1) return [str, ''];
    return [str.substring(0, index).trim(), str.substring(index + 1).trim()];
}

export const isSafari = (() => {
    const ua = navigator.userAgent;
    return /Safari/.test(ua) && !/Chrome/.test(ua);
})();

export function mergeSet (s1?: Set<any>, s2?: Set<any>): any {
    if (!s1) return s2;
    if (!s2) return s1;
    s2.forEach(item => {s1.add(item);});
    return s1;
}

export function assignLast (a1: any[], v: any): void {
    a1[a1.length - 1] = v;
}

export function isSimpleValue (v: any) {
    return typeof v !== 'object' || v === null;
}