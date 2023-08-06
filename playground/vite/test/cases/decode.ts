/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-13 17:17:43
 * @Description: Coding something
 */

import {longToNumber} from '../../src/prodec';
import encodeData, {map, parser} from './encode';
import {decodePB} from './protobuf';
import {deepClone} from './utils';

console.warn('【protobuf EncodedData】', encodeData);


const result = encodeData.map(item => {
    const {key, expect} = item;
    const u8Arr = new Uint8Array(expect);
    console.log(decodePB(key, u8Arr));
    console.log({...deepClone(decodePB(key, u8Arr))});

    return {
        name: `解码测试 key=【${item.key}】`,
        disabled: false,
        test () {
            console.log(u8Arr);
            // debugger;
            // @ts-ignore
            const data = parser[key].decode(u8Arr);
            // return [data, data];
            // 先简单处理一下 long 类型 不考虑超过 max-safe情况 和 负数
            // todo 64 位使用字符串改造
            for (const k in data) {
                const item = data[k];
                if (typeof item.low === 'number') {
                    console.log(item);
                    const v = longToNumber(item);
                    // debugger;
                    data[k] = Number(v);
                }
            }
            return data;
            // return  {a3: 9007199254741000};
        },
        // expect: [{...decodePB(key, expect)}, map[key]]
        // ! protobufjs 解出来对象 不是 json 所以这里做一下格式清楚
        expect: deepClone({...decodePB(key, u8Arr)}),
        // expect: decodePB(key, u8Arr),
        // expect: {a3: 9007199254741000}
    };
});

console.warn('【protobuf DecodedData】', result);

console.warn('【protobuf DecodedData】', {...deepClone({...result[2].expect})});


(window as any).result = result;
(window as any).encodeData = encodeData;


export default result;

