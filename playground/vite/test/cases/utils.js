/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-13 18:22:55
 * @Description: Coding something
 */
// 简单处理一下
export function deepClone (data) {
    return JSON.parse(JSON.stringify(data));
}