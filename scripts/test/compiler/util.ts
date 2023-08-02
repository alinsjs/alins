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
    return codeMap.map((item, index) => ({
        name: item.name || `test-compile-react-${index}`,
        disabled: item.disabled ?? false,
        test ({parse}: any) {
            return parse(item.input || '').replace('"use strict";', '').trim();
        },
        expect: item.output.trim(),
    })) as ITestConfigItem[];
}