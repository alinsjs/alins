/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-03 00:08:16
 * @Description: Coding something
 */
import {ITestConfigItem} from 'easy-test-lib';

export interface ICodeMap {
    name?: string;
    disabled?: boolean;
    input: string;
    output: string;
}

export function createTestCase (codeMap: ICodeMap[]) {
    const isWeb = 'object' === typeof window && !!window.navigator;
    const head = isWeb ? 'var _$$ = window.Alins._$$;\n' : 'import { _$$ } from "alins";\n';
    return codeMap.map((item, index) => ({
        name: item.name || `test-compile-react-${index}`,
        disabled: item.disabled ?? false,
        test ({parse}: any) {
            return parse(item.input || '').replace('"use strict";', '').trim();
        },
        expect: `${head}${item.output.trim()}`,
    })) as ITestConfigItem[];
}