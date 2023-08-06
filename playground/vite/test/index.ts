/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:11
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-19 12:02:40
 */
import {startTest} from 'easy-test-lib';
import decode from './cases/decode';
import encode from './cases/encode';

console.log(decode.length + encode.length);

startTest({
    cases: [
        ...decode,
        ...encode,
    ],
    onTestSingle (item) {
        console.log(`[passed=${item.passed}]`, item);
    },

    onTestComplete ({passed, results, time}) {
        console.log(`%c【TEST ${passed ? 'PASSED' : 'FAILED'}!】[time=${time}]`, `color: ${passed ? 'green' : 'red'}`);

        results.forEach(({name, index, passed, result, expect}) => {
            const text = `%c【name=${name}】[${index}]${passed ? 'passed' : 'failed'} 
    result:${JSON.stringify(result)} ${!passed ? `
    expect:${JSON.stringify(expect)}` : ''}`;
            console.log(text, `color: ${passed ? 'green' : 'red'}`);
        });

    }
});