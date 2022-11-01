/*
 * @Author: chenzhongsheng
 * @Date: 2022-10-24 10:31:38
 * @Description: Coding something
 */
const {build} = require('esbuild');
const {resolve} = require('path');
const {yamlPlugin} = require('esbuild-plugin-yaml');
const {dtsPlugin} = require('esbuild-plugin-d.ts');
const vuePlugin = require('esbuild-plugin-vue3');

const outfile = resolve(__dirname, './dev/bundle.js');

build({
    // entryPoints: [resolve(__dirname, './dev/index.ts')],
    entryPoints: [resolve(__dirname, './dev/samples/alins/src/Main.js')],
    outfile,
    bundle: true,
    sourcemap: true,
    format: 'cjs',
    globalName: 'Alins',
    platform: 'browser',
    // plugins:
    //   format === 'cjs' || pkg.buildOptions?.enableNonBrowserBranches
    //     ? [nodePolyfills.default()]
    //     : undefined,
    // define: {
    //   __COMMIT__: '"dev"',
    //   __VERSION__: `"${pkg.version}"`,
    //   __DEV__: 'true',
    //   __TEST__: 'false',
    //   __BROWSER__: String(format !== 'cjs' && !pkg.buildOptions?.enableNonBrowserBranches),
    //   __GLOBAL__: String(format === 'global'),
    //   __ESM_BUNDLER__: String(format.includes('esm-bundler')),
    //   __ESM_BROWSER__: String(format.includes('esm-browser')),
    //   __NODE_JS__: String(format === 'cjs'),
    //   __SSR__: String(format === 'cjs' || format.includes('esm-bundler')),
    //   __COMPAT__: String(target === 'vue-compat'),
    //   __FEATURE_SUSPENSE__: 'true',
    //   __FEATURE_OPTIONS_API__: 'true',
    //   __FEATURE_PROD_DEVTOOLS__: 'false',
    // },
    plugins: [
        yamlPlugin(),
        dtsPlugin(),
        vuePlugin(),
    ],
    watch: {
        onRebuild (error) {
            if (!error) console.log(`rebuilt: ${outfile}`);
        },
    },
}).then(() => {
    console.log(`watching: ${outfile}`);
});
