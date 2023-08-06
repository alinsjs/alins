/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-13 17:17:47
 * @Description: Coding something
 */
// import {parser} from './decode';
// import {encodeTest3} from '../pbjs';
import {encodePB} from './protobuf';

import data from '../test-pb.proto';
import {numberToLong, createPBParser} from '../../src/prodec';

export const parser = createPBParser(data);

console.log(parser, data);
export const map = {
    Test3: {
        'role': 2,
        'players': ['111', '222'],
        'age': 150,
    },
    SubRepeated: {
        base: [{base: 1}, {base: 2}]
    },
    // Number: {
    //     a1: true,
    //     a2: 2,
    //     a3: 3,
    //     a4: 4,
    //     a5: 5,
    //     a6: 6,
    //     a7: 7,
    //     a8: 8,
    //     a9: 9,
    //     a10: 10,
    //     a11: 11,
    //     a12: 12,
    //     a13: 13,
    // },

    // (1 ^ 2**31-1).toString(2)
    Number: {
        a1: true,
        a2: -2, // int32 a2 = 2;
        a3: -2, // int64
        // a3: 9007199254740991, // int64
        a4: 4, // sint32
        a5: 9007199254740990, // sint64
        a6: 6, // uint32
        a7: numberToLong(9007199254740999n), // uint64
        a8: 9007199254740991, // fixed64
        a9: 9, // sfixed64
        a10: 10, // fixed32
        a11: 11, // sfixed32
        a12: -12.1, // float
        a13: 0.1, // double
        // a1: true,
        // a2: 2,
        // a3: 9007199254740991,
        // a3: 900719925474091,
        // a3: 8388608111,
        // a3: 123,
        // a4: 4,
        // a5: 5,
        // a6: 6,
        // a7: 7,
        // a8: 8,
        // a9: 9,
        // a10: 10,
        // a11: 11,
        // a12: 12.1,
        // a13: 333,
    }
};

export default Object.keys(map).map((key) => {
    const data = map[key];
    return {
        key,
        name: `编码测试 key=【${key}】`,
        disabled: false,
        test () {
            return [].slice.call(parser[key].encode(data));
        },
        // expect: [].slice.call(encodeTest3(dataTest3))
        expect: encodePB(key, data),
    };
});
