/*
import default from './test/cases/async';
 * @Author: chenzhongsheng
 * @Date: 2022-10-24 10:31:38
 * @Description: Coding something
 */
const esbuild = require('esbuild');
const { resolveRootPath } = require('./helper/utils');
const fs = require('fs');

const mode = process.argv[2] || 'dev_web';

const entry = ({
    dev_node: 'scripts/dev/dev-node.ts',
    test_compiler_node: 'scripts/test/compiler/node.ts',
    test_compiler_web: 'scripts/test/compiler/web.ts',
    dev_web: 'scripts/dev/dev-web-compiler.ts',
    dev_web_standalone: 'scripts/dev/dev-web-standalone.ts',
    test_web: 'scripts/test/client/index.ts',
})[mode];

if (mode === 'dev_web') {
    const files = fs.readdirSync(resolveRootPath('scripts/dev/samples'));
    fs.writeFileSync(resolveRootPath('scripts/dev/samples-list.ts'), `export default ${JSON.stringify(files)};`, 'utf8');
}

main(
    resolveRootPath(entry),
    resolveRootPath('scripts/dev/bundle.min.js')
);

async function main (entry, outfile) {
    const isWeb = mode.includes('web');
    const context = await esbuild.context({
        entryPoints: [ entry ],
        outfile,
        bundle: true,
        sourcemap: isWeb,
        format: isWeb ? 'esm' : 'cjs',
        globalName: 'Alins',
        platform: 'node',
        define: {
            'process.env.NODE_ENV': '"development"',
            '__DEV__': 'true',
            '__DEBUG__': 'true',
            '__VERSION__': '"0.0.1-dev"'
        },
        plugins: [
        ],
    });
    await context.watch();
    console.log(`watching: ${outfile}`);
}
