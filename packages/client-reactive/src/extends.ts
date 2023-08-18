/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-18 23:47:24
 * @Description: Coding something
 */
import {isProxy} from './proxy';

export function assignData (...data: any[]) {
    data.forEach((item, index) => {
        if (isProxy(item)) {
            const newData = {};
            for (const k in item) {
                newData[k] = () => item[k];
            }
            data[index] = newData;
        }
    });
    // @ts-ignore
    return Object.assign.apply(null, data);
}