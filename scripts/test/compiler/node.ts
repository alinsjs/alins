/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-13 11:08:13
 * @Description: Coding something
 */
/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-13 08:53:45
 * @Description: Coding something
 */
import {parseAlins} from 'packages/compiler-node';
import {startTestMain} from './compiler-base';
import chalk from 'chalk';

const _ = console.log;
const isUd = function (o: any) {return typeof o === 'undefined';};

const log = {
    n: function (txt: string) {
        if (isUd(txt)) {
            _();
            return;
        }
        _(txt);
    },
    green: function (txt: string) {
        _(chalk.green(txt));
    },
    red: function (txt: string) {
        _(chalk.red(txt));
    },
    log: function (txt: string) {
        _(txt);
    },
};

startTestMain(parseAlins, log);

// console.log(parseAlins('<div></div>'));

