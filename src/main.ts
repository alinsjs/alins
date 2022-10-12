/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:33:13
 * @Description: Coding something
 */
import {mount} from './core/mount';
import {div} from './core/builder/builder';
import {parseDomInfo} from './core/parser/info-parser';
import {react} from './core/reactive/react';

const data = react('World');

mount('body',
    div('.aaa#id[a=1]', react`:Hello ${data}`, [
        div('.aaa:sds', [
            div('.aaa:sdfa'),
            div('.aaa:sdfa')
        ])
    ])
);

// data.set('');

// data.value;
 
(window as any).parseDomInfo = parseDomInfo;