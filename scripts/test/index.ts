/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 13:52:04
 * @Description: Coding something
 */
import {startTest} from 'easy-test-lib';
import reactive from './cases/reactive';
import ifCase from './cases/if';


export function startTestMain () {
    startTest({
        cases: [
            // ...reactive,
            ...ifCase,
        ],
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
}