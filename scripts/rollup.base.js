/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:40:33
 * @Description: Coding something
 */
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const {babel} = require('@rollup/plugin-babel');
const dts = require('rollup-plugin-dts').default;
const typescript = require('rollup-plugin-typescript2');
const yaml = require('@rollup/plugin-yaml');
const commonjs = require('@rollup/plugin-commonjs');
const {uglify} = require('rollup-plugin-uglify');
const packageInfo = require('../package.json');
const rollup = require('rollup');

const {
  resolveRootPath, transfromFilePath
} = require('./utils');

const extensions = ['.ts', '.d.ts', '.js'];
const inputFile = resolveRootPath('src/index.ts');

async function builddts ({
  input = inputFile,
  output = resolveRootPath('npm/ebuild-demo.min.d.ts'),
} = {}) {
  await buildBase({
    inputOptions: {
      input,
      plugins: [dts()],
    },
    outputOptions: {
      file: output,
      format: 'es',
    },
  });
}

async function build ({
  input = inputFile,
  output = resolveRootPath('npm/ebuild-demo.min.js'),
  format = 'umd',
  external = packageInfo.external,
  name = 'EbuildDemo',
} = {}) {
  const inputOptions = {
    input: transfromFilePath(input), // 唯一必填参数
    external,
    plugins: [
      uglify(),
      commonjs(),
      yaml(),
      typescript(),
      nodeResolve({
        extensions,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
      }),
    ],
  };
  const outputOptions = {
    file: transfromFilePath(output),   // 若有bundle.write，必填
    format, // 必填
    name,
  };

  await buildBase({
    inputOptions,
    outputOptions,
  });
}

async function buildBase ({
  inputOptions,
  outputOptions,
}) {
  const bundle = await rollup.rollup(inputOptions);
  //   console.log(bundle.imports); // an array of external dependencies
  //   console.log(bundle.exports); // an array of names exported by the entry point
  //   console.log(bundle.modules); // an array of module objects
  //   // generate code and a sourcemap
  //   const { code, map } = await bundle.generate(outputOptions);
  await bundle.write(outputOptions);
}

module.exports = {
  buildBase,
  build,
  builddts
};