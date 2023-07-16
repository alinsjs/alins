import {createTestBase, mockFetch, delay} from '../test-util';
import {JSX as React} from 'packages/core/src/element/element';

// function dom () {
//     if (a) {
//         const result = await mockFetch(2);
//         data.a = result;
//         return <div>{data.a}</div>;
//     }
// }
export default [

    {
        name: 'async base',
        disabled: false,
        async test () {
            const {list, ctx, data, container, collect, str} = createTestBase();

            /*
            async function dom() {
                const result = await mockFetch(2);
                return <span>async{result}-{() => data.b}</span>;
            }
            */

            const fn = async () => {
                const result = await mockFetch(2);
                return <span>async{result}-{() => data.b}</span>;
            };

            const dom = ctx.ce(fn);

            container.appendChild(dom);
            collect();
            await delay(600);
            collect();
            data.b = 2;
            collect();

            return list;
        },
        expect: ['', 'async2-1', 'async2-2']
    },
    {
        name: 'async base2',
        disabled: false,
        async test () {
            const {list, ctx, data, container, collect, str} = createTestBase();

            /*
            async function dom() {
                // ! 这种的await会被data.c=1时重复触发
                if(data.c === 1){
                    const result = await mockFetch(2);
                    data.a = result;
                }
                return <div>{data.a}</div>
            }
            */
            const fn = () => {
                ctx.if(() => data.c === 2, ctx.anr(async () => {
                    const result = await mockFetch(2);
                    data.a = result;
                })).end();
                return <div>{() => data.a}</div>;
                // if (d) return d;
            };
            window.data = data;
            const dom = ctx.ce(fn);

            container.appendChild(dom);
            await delay(10);
            collect();
            data.c = 2;
            collect();
            await delay(120);
            collect();
            data.c = 3;
            data.a = 3;
            collect();
            data.c = 2;
            await delay(120);
            collect();

            return list;
        },
        expect: ['1', '1', '2', '3', '2']
    },
    {
        name: 'if + async',
        disabled: false,
        async test () {
            const {list, ctx, data, container, collect, str} = createTestBase();

            const dom = (() => {
                return ctx.if(() => data.a === 2, async () => {
                    const result = await mockFetch(2);
                    return <span>async{result}-{() => data.b}</span>;
                }).else(() => {
                    return <div>else</div>;
                });
            })();

            container.appendChild(dom);
            // delay(500);
            collect();
            data.a = 2;
            collect();
            await delay(120);
            collect();
            data.b = 2;
            collect();

            return list;
        },
        expect: ['else', '', 'async2-1', 'async2-2']
    },
    {
        name: 'if + async 2',
        disabled: false,
        async test () {
            const {list, ctx, data, container, collect, str} = createTestBase();

            /*
            const dom = async ()=>{
                if(data.a === 1){
                    const result = await mockFetch(2);
                    return <span>async{result}-{() => data.b}</span>;
                }else{
                    return <div>else</div>;
                }
            }

            */

            const fn = (() => {
                return ctx.if(() => data.a === 1, async () => {
                    const result = await mockFetch(2);
                    console.warn('2222222222', result);
                    return <span>async{result}-{() => data.b}</span>;
                }).else(() => {
                    return <div>else</div>;
                });
            });

            const dom = ctx.ce(fn);
            window.data = data;
            container.appendChild(dom);
            collect();
            console.log('set a=2');
            data.a = 2;
            collect();
            console.log('set a=2 done');
            await delay(120);
            console.log('set a=1');
            data.a = 1;
            data.b = 2;
            collect();
            console.log('set a=1 done');

            return list;
        },
        expect: ['', 'else', 'async2-2']
    },
    {
        name: 'new async',
        disabled: false,
        async test () {
            const {list, ctx, data, container, collect, str} = createTestBase();
            const dom = () => {
                return ctx.if(() => data.a === 1, async () => {
                    console.warn('asyncdebug call-----------');
                    // debugger;
                    const result = await mockFetch(2);
                    console.warn(`asyncdebug call result-----------${result}`);
                    return <span>async{result}-{() => data.b}</span>;
                }).else(() => {
                    console.warn('asyncdebug: else');
                    return <div>else</div>;
                });
            };
            window.data = data;

            const d = ctx.ce(dom);

            container.appendChild(d);
            collect();
            data.a = 2;
            collect();
            await delay(120);
            data.a = 1;
            collect();

            return list;
        },
        expect: ['', 'else', 'async2-1']
    }
];


// export async function Fn () {
//     const a = await aa();
//     return <div>{a}</div>;
// }


// const dom = <div onabort={} onclick={}>
//     <Fn></Fn>
// </div>;