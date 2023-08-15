/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-13 08:53:45
 * @Description: Coding something
 */
import {parseWebAlins} from 'packages/compiler-web';
import {startTestMain} from './compiler-base';

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
        _(`%c${txt}`, 'color: green');
    },
    red: function (txt: string) {
        _(`%c${txt}`, 'color: red');
    },
    log: function (txt: string) {
        _(txt);
    },
};

// console.log(parseWebAlins, startTestMain);

startTestMain(parseWebAlins, log);