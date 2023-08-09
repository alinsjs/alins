/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 13:52:04
 * @Description: Coding something
 */
import {startTest} from 'easy-test-lib';
import react from './compiler-cases/react';
import jsx from './compiler-cases/jsx';
import ifCase from './compiler-cases/if';
import asyncCase from './compiler-cases/async';
import switchCase from './compiler-cases/switch';
import mapCase from './compiler-cases/map';
import test from './compiler-cases/test';
import mix from './compiler-cases/mix';
import {createTestCase} from './util';

export function startTestMain (
    parse: any,
    log: {n:(t:string)=>void, red:(t:string)=>void, green:(t:string)=>void, log: (t:string)=>void
}) {
    startTest({
        args: {parse},
        cases: createTestCase([
            ...react,
            ...jsx,
            ...ifCase,
            ...asyncCase,
            ...switchCase,
            ...mapCase,
            ...mix,
            ...test,
        ]),
        onTestComplete ({passed, results, time}) {
            let failCount = 0;
            const logResult = () => {
                log[passed ? 'green' : 'red'](`【TEST ${passed ? 'PASSED' : 'FAILED'}!】[count=${results.length}; ${failCount ? `fail=${failCount};` : ''} time=${time}]`);
            };
            logResult();
            // console.log(results);
            results.forEach(({name, disabled, index, passed, result, expect}) => {
                if (passed) {
                    if (!disabled) log.green(`【name=${name}】PASSED!`);
                    return;
                }
                failCount ++;
                log[passed ? 'green' : 'red'](`【name=${name}】[${index}]${passed ? 'passed' : 'failed'}!`);
                // const text = ` ----result:${JSON.stringify(result)} ${!passed ? `\n ----expect:${JSON.stringify(expect)}` : ''}`;
                console.log('-----result:');
                console.log(result);
                if (!passed) {
                    console.log('-----expect:');
                    console.log(expect);
                }
            });
            logResult();
        }
    });
}