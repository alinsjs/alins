import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Main () {
    const [ count, setCount ] = useState(1);
    function increase () {
        setCount(count + 1);
    }
    return <button onClick={increase}>
        add {count}
    </button>;
}

ReactDOM.render(
    <Main/>,
    document.body
);

