/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:33:13
 * @Description: Coding something
 */
import {mount} from './core';
import {div} from './core/builder';
import {parseDomInfo} from './core/parser/info-parser';

mount('body',
    div('.aaa#id[a=1]:Hello World', [
        div('.aaa:sds', [
            div('.aaa:sdfa'),
            div('.aaa:sdfa')
        ])
    ])
);
 
(window as any).parseDomInfo = parseDomInfo;