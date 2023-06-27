/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-19 07:49:39
 */

import {Path} from 'packages/path/src/index';


export default [
    {
        name: 'Root Parent Path',
        disabled: false,
        test () {
            return [
                Path.from('/a/b/').parentPath,
                Path.from('/a/b').parentPath,
                Path.from('/a/').parentPath,
                Path.from('/').parentPath,
            ];
        },
        expect: [
            '/a/b', '/a', '/a', '/'
        ]
    }, {
        name: 'Relative Parent Path',
        disabled: false,
        test () {
            return [
                Path.from('a/').parentPath,
                Path.from('a').parentPath,
                Path.from('a/b').parentPath,
                Path.from('').parentPath,
            ];
        },
        expect: [
            'a', '..', 'a', '..'
        ]
    }, {
        name: 'Back Parent Path',
        disabled: false,
        test () {
            return [
                Path.from('..').parentPath,
                Path.from('../').parentPath,
                Path.from('../..').parentPath,
                Path.from('../../').parentPath,
                Path.from('../a').parentPath,
            ];
        },
        expect: [
            '../..', '../..', '../../..', '../../..', '..'
        ]
    }, {
        name: 'Root Join',
        disabled: false,
        test () {
            return [
                Path.from('/').join('../../').path,
                Path.from('/').join('aa').path,
                Path.from('/').join('../aa').path,
                Path.from('/').join('../aa', 'b/c').path,
                Path.from('/').join('../aa', 'b/c/').path,
                Path.from('/').join('../aa', 'b/c', '../d').path,
                Path.from('/').join('../aa', 'b/c', '../../d').path,
                Path.from('/').join('..').path,
            ];
        },
        expect: [
            '/', '/aa', '/aa', '/aa/b/c', '/aa/b/c/', '/aa/b/d', '/aa/d', '/'
        ]
    }, {
        name: 'Relative Join',
        disabled: false,
        test () {
            return [
                Path.from('x').join('../../').path,
                Path.from('x').join('aa').path,
                Path.from('x').join('../aa').path,
                Path.from('x').join('../aa', 'b/c').path,
                Path.from('x').join('../aa', 'b/c/').path,
                Path.from('x').join('../aa', 'b/c', '../d').path,
                Path.from('x').join('../aa', 'b/c', '../../d').path,
                Path.from('x').join('../../..').path,
                Path.from('x').join('../../../').path,
                Path.from('../x').join('aa').path,
                Path.from('x').join('..').path,
                Path.from('x/y').join('..').path,
                Path.join(''),
                Path.join('', ''),
                Path.join('', '..'),
                Path.join('', '..', './'),
            ];
        },
        expect: [
            '..', 'x/aa', 'aa', 'aa/b/c', 'aa/b/c/', 'aa/b/d',
            'aa/d', '../..', '../..', '../x/aa', '', 'x/',
            '', '', '../', '../'
        ]
    }, {
        name: 'Last',
        disabled: false,
        test () {
            return [
                Path.from('x').last,
                Path.from('/x').last,
                Path.from('../x').last,
                Path.from('a/x').last,
                Path.from('../').last,
                Path.from('..').last,
                Path.from('x/').last,
                Path.from('/').last,
            ];
        },
        expect: [
            'x', 'x', 'x', 'x', '', '', '', ''
        ]
    }
];