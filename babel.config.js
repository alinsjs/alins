/*
 * @Author: tackchen
 * @Date: 2022-09-30 09:43:03
 * @Description: Coding something
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        targets: {
          esmodules: true,
          ie: 11,
        },
      },
    ],
    '@babel/preset-typescript',
  ],
};

