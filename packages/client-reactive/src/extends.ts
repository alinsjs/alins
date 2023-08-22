/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-18 23:47:24
 * @Description: Coding something
 */
import {computed} from './computed';
import {isProxy} from './proxy';

export function assignData (...data: any[]) {
    return assignBase(data, false);
}

export function assignCompData (...data: any[]) {
    return assignBase(data, true);
}

function assignBase (data: any[], isComp: boolean) {
    data.forEach((item, index) => {
        if (isProxy(item)) {
            const newData = {};
            for (const k in item) {
                newData[k] = () => item[k];
                if (isComp) {
                    newData[k] = computed(newData[k]);
                }
            }
            data[index] = newData;
        }
    });
    // @ts-ignore
    return Object.assign.apply(null, data);
}