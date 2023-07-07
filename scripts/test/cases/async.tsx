import {createTestBase, mockFetch, delay} from "../test-util";

export default [

    {
        name: 'async base',
        disabled: false,
        async test () {
            const {list, ctx, data, container, collect, str} = createTestBase();

            /*
            function dom() {
                const result = await mockFetch(2);
                data.a = result;
                return <div>{data.a}</div>
            }
            */

            const dom = (()=>{
                return ctx.async(async ()=>{
                    const result = await mockFetch(2);
                    return <span>async{result}-{()=>data.b}</span>
                }, true)
            })()

            container.appendChild(dom);
            collect();
            await delay(600);
            collect();
            data.b = 2
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
                if(data.c === 1){
                    const result = await mockFetch(2);
                    data.a = result;
                }
                return <div>{data.a}</div>
            }
            */
            const dom = (()=>{
                ctx.if(()=>data.c === 1, ()=>{
                    ctx.async(async ()=>{
                        const result = await mockFetch(2);
                        data.a = result;
                    }, false)
                })
                return <div>{()=>data.a}</div>
            })()

            container.appendChild(dom);
            collect();
            data.c === 1;
            collect();
            await delay(600);
            collect();

            return list;
        },
        expect: ['1', '1', '2']
    },
    {
        name: 'if + async',
        disabled: false,
        async test () {
            const {list, ctx, data, container, collect, str} = createTestBase();

            const dom = (()=>{
                return ctx.if(()=>data.a === 2, ()=>{
                    return ctx.async(async ()=>{
                        const result = await mockFetch(2);
                        return <span>async{result}-{()=>data.b}</span>
                    }, true)
                }).else(()=>{
                    return <div>else</div>
                })
            })()

            container.appendChild(dom);
            collect();
            data.a = 2
            collect();
            await delay(600);
            collect();
            data.b = 2
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

            const dom = (()=>{
                return ctx.if(()=>data.a === 1, ()=>{
                    console.warn('async call-----------')
                    debugger;
                    return ctx.async(async ()=>{
                        const result = await mockFetch(2);
                        return <span>async{result}-{()=>data.b}</span>
                    }, true)
                }).else(()=>{
                    return <div>else</div>
                })
            })()

            container.appendChild(dom);
            collect();
            data.a = 2
            collect();
            await delay(600);
            data.a = 1
            collect();

            return list;
        },
        expect: ['', 'else', 'async2-1']
    }
]