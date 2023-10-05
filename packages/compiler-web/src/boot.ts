/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 11:53:54
 * @Description: Coding something
 */

import {
    _$c, _$cc, _$ce, _$e, _$es, _$if, _$mf, _$mm, _$mnr,
    _$mu, _$r, _$sw, _$w, _$mt,
    _$ad, _$cd, _$md, _$rd,
    version, createStore,
    defineRenderer, useRenderer,
    ref, reactive, computed, watch, observe,
    mount, mounted, removed, created, appended,
} from 'alins';
import { parseWebAlins } from './parser';
import { IImportType } from 'alins-compiler-core';

function onDOMContentLoaded () {
    const names = [ 'alins', 'babel', 'jsx' ];
    for (const name of names) {
        const scripts = document.querySelectorAll(`script[type="text/${name}"]`);
        // @ts-ignore
        for (const item of scripts) {
            // @ts-ignore
            onSingleScript(item, item.getAttribute('import') || 'iife', item.hasAttribute('ts'));
        }
    }
}

async function onSingleScript (script: HTMLScriptElement, importType: IImportType = 'iife', ts = false) {
    // __DEV__ && console.log(`web=${web}; ts=${ts}`);
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
    const output = parseWebAlins(code, { importType, ts });
    // console.warn(code);
    // console.warn('============>');
    if (__DEV__) console.warn('Compiler output:', output);
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
    window.Alins = {
        _$c, _$cc, _$ce, _$e, _$es, _$mf, _$mm, _$mnr, _$mt,
        _$mu, _$r, _$sw, _$w, _$if, version, createStore,
        _$ad, _$cd, _$md, _$rd,
        useRenderer,
        defineRenderer,
        ref, reactive, computed, watch, observe,
        mount, mounted, removed, created, appended,
    };
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
