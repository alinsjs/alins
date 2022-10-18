/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:41:40
 * @Description: Coding something
 */
export interface IJson<T = any> {
    [prop: string]: T;
}