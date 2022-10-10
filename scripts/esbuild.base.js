
/*
 * @Author: tackchen
 * @Date: 2022-09-30 19:26:59
 * @Description: Coding something
 */
const {build} = require('esbuild');
const {yamlPlugin} = require('esbuild-plugin-yaml');
const {dtsPlugin} = require('esbuild-plugin-d.ts');
const {
  transfromFilePath
} = require('./utils');

function buildBaseConfig ({
  inputFile = '@scripts/dev/index.ts',
  outFile = '@scripts/dev/bundle.js'
} = {}) {
  let index = 0;
  return {
    entryPoints: [
      transfromFilePath(inputFile)
    ],
    outfile: transfromFilePath(outFile),
    bundle: true,
    sourcemap: true,
    format: 'cjs',
    globalName: 'EbuildDemo',
    platform: 'browser',
    // plugins:
    //   format === 'cjs' || pkg.buildOptions?.enableNonBrowserBranches
    //     ? [nodePolyfills.default()]
    //     : undefined,
    // define: {
    //   __COMMIT__: '"dev"',
    //   __VERSION__: `"${pkg.version}"`,
    // },
    plugins: [
      yamlPlugin(),
      dtsPlugin(),
    ],
    watch: {
      onRebuild (error) {
        index ++;
        if (!error) console.log(`sl:rebuilt: ${outFile} x ${index} [${new Date().toLocaleTimeString()}]`);
      },
    },
  };
}

function esbuild (config) {
  build(config).then(() => {
    console.log(`watching: ${config.outfile}`);
  });
}

module.exports = {
  esbuild,
  buildBaseConfig,
};