/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 13:52:04
 * @Description: Coding something
 */
import {startTest} from 'easy-test-lib';
import reactive from './cases/reactive';
import dom from './cases/dom';
import ifCase from './cases/if';
import asyncCase from './cases/async';
import switchCase from './cases/switch';
import {react, watch} from 'packages/reactive/src';
window.react = react;
window.watch = watch;
function startTestMain () {
    startTest({
        cases: [
            // ...dom,
            // ...reactive,
            // ...ifCase,
            // ...asyncCase,
            // ...switchCase,
        ],
        onTestComplete ({passed, results, time}) {
            console.log(`%c【TEST ${passed ? 'PASSED' : 'FAILED'}!】[time=${time}]`, `color: ${passed ? 'green' : 'red'}`);
            console.log(results);
            results.forEach(({name, index, passed, result, expect}) => {
                console.log(`%c【name=${name}】[${index}]${passed ? 'passed' : 'failed'}!`, `color: ${passed ? 'green' : 'red'}`);
                const text = ` ----result:${JSON.stringify(result)} ${!passed ? `
 ----expect:${JSON.stringify(expect)}` : ''}`;
                console.info(text);
            });

        }
    });
}

startTestMain();