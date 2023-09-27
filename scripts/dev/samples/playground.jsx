
function Component () {
    appended: dom => {
        console.log('111', dom);
    };
    return <div>
        111
        <Comp2></Comp2>
    </div>;
}

function Comp2 () {
    mounted: dom => {
        console.log('222', dom);
        return (dom) => {
            console.log('333', dom);
        };
    };
    return <div>22</div>;
}

<Component $$App $appended={dom => {
    console.log(11111, dom);
}}/>;