/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:54:25
 * @Description: Coding something
 */
export function split (str: string, s: string): [string, string] {
    const index = str.indexOf(s);
    if (index === -1 || !s) return [str, ''];
    return [str.substring(0, index), str.substring(index + 1)];
}

export function join (array: string[], fn: string[] | ((index: number)=>string)) {
    let str = '';
    for (let i = 0; i < array.length - 1; i++) {
        str += `${array[i]}${typeof fn === 'function' ? fn(i) : fn[i]}`;
    }
    return str + array[array.length - 1];
}