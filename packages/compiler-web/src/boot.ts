/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 11:53:54
 * @Description: Coding something
 */

import {createContext} from 'alins';
import {parseWebAlins} from './parser';

function onDOMContentLoaded () {

    const names = ['alins', 'babel'];
    for (const name of names) {
        const scripts = document.querySelectorAll(`script[type="text/${name}"]`);
        // @ts-ignore
        for (const item of scripts) {
            // @ts-ignore
            onSingleScript(item);
        }
    }
}

async function onSingleScript (script: HTMLScriptElement) {
    let code = '';
    if (script.innerText.trim() === '') {
        if (script.src) {
            const result = await fetch(script.src);
            if (result.status === 200) {
                code = await result.text();
            } else {
                throw new Error(result.statusText);
            }
        }
    } else {
        code = script.innerText;
    }
    const output = parseWebAlins(code);
    // console.warn(code);
    // console.warn('============>');
    // console.warn(output);
    // debugger;
    if (output) {
        // exeJs(output);
        const script = document.createElement('script');
        script.textContent = output;
        // script.innerHTML = output;
        document.head.appendChild(script);
    }
}

if (typeof window !== 'undefined') {
    // @ts-ignore
    window.Alins = {_$$: createContext};
    window.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);
}

// function exeJs (code) {
//     const blob = new Blob([ code ], {type: 'text/javascript'});
//     const objectURL = window.URL.createObjectURL(blob);
//     const script = document.createElement('script');
//     script.onload = () => {
//     	console.log('loaded');
//     };
//     script.src = objectURL;
//     document.head.appendChild(script);
// }
