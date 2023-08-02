/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-07 22:36:11
 * @Description: Coding something
 */

export async function mockFetch <T> (s: T) {
    await delay(100);
    return s;
}
export function delay (time = 500) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(1);
        }, time);
    });
}