/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:32:10
 * @Description: Coding something
 */
import 'packages/compiler-web';
import samplesList from './samples-list';

document.write(`<div style="margin-bottom: 10px; font-size: 18px; display: flex; gap: 3px 15px; flex-wrap: wrap;">
    ${samplesList.map(name => {
        return `<a style="color:#000" href="/?file=${name}">${name}</a>`;
    }).join(' ')}
<div>`);


const searchParams = new URLSearchParams(location.search);

const name = searchParams.get('file') || 'increment';

document.write(`<script type="text/alins" src="./samples/${name}.tsx"></script>`);
