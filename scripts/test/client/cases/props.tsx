/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-25 11:17:12
 * @Description: Coding something
 */
function normal(){
    let a = 1;

    a++;

    <div $$App>
        <Component a={a} b={a+1}/>
    </div>;

    function Component({a: A, b, c=1}){
        return <div>{A}{b+1}{c}</div>
    }
}

function spread(){
    let a = {a:1,b:2};
    a.a ++;

    <div $$App>
        <Component {...a}/>
    </div>;

    function Component({a: A, b, c=1}){
        return <div>{A}{b+1}{c}</div>
    }
}

function staticSpread(){
    let a = {a:1,b:2};

    <div $$App>
        <Component {...a}/>
    </div>;

    function Component({a: A, b, c=1}){
        return <div>{A}{b+1}{c}</div>
    }
}

function propsExtend(){
    let a = 1;

    a++;

    <div $$App>
        <Component a={a} b={a+1}/>
    </div>;

    function Component({a: A, b, c=1}){
        return <div>{A}{b+1}{c}</div>
    }
}

function props(){
    let a = {a:1,b:2};
    a.a = 2;
    
    <div $$App>
        <Component {...a}/>
    </div>;
    
    function Component(props){
        console.log(props.a);
        return <div>{props.a}{props.b+1}</div>
    }
}