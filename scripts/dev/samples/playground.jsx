function Main () {


    let a = 0;

    a++;
    window.a = a;


    switch (a) {
        case 1: console.log(1);
        case 2: {
            console.log(2);
        };
        case 3: {
            return <span>3</span>;
        };
        case 4: {
            return <span>4</span>;
        }
    }
    return <span>x</span>;
}

<Main $$App></Main>;