/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-06 16:20:04
 * @Description: Coding something
 */
// ! 模改babel-standalone 目的是为了去掉babel内部自动执行 text/babel 的逻辑

declare const Babel: {
    transform(code: string, options: any): {code: string};
    registerPlugin(name: string, plugin: any): void;
};

export default Babel;