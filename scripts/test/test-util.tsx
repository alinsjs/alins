/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-07 22:36:11
 * @Description: Coding something
 */
import { createContext } from 'packages/core/src/context';

export async function mockFetch <T>(s: T){
    await delay(500);
    return s;
}
export function delay (time = 500){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(1)
        }, time);
    })
}

export function createTestBase (){
    const list: string[] = []
    const ctx = createContext();
    const data = ctx.$({a: 1, b: 1, c: 1});
    const str = ctx.$('1');
    const container = document.createElement('div');
    document.body.appendChild(container);
    const collect = () => {list.push(container.innerText);}
    return {list, ctx, data, container, collect, str}
}