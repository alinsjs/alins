/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-19 14:01:37
 * @Description: Coding something
 */
export function createScopeStack<T> () {
    const stack: T[] = [];

    return {
        pop () {
            return stack.pop();
        },
        newNode (node: T) {
            // @ts-ignore
            node.parent = this.getParent();
            stack.push(node);
        },
        getParent () {
            return stack[stack.length - 1] || null;
        }
    };
}