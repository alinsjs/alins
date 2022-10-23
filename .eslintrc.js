module.exports = {
    // "parser": '@typescript-eslint/parser', // 启用会导致vue文件eslint错误
    extends: [
        'plugin:vue/vue3-recommended'
    ],
    'plugins': [
        '@typescript-eslint',
    ],
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
        'commonjs': true
    },
    // 接入vue失败 暂且eslint 忽略vue文件
    'extends': [
    // "standard",
        'plugin:vue/essential'
    ],
    'parserOptions': {
    // "parser": "babel-eslint",
        'parser': '@typescript-eslint/parser',
        'ecmaVersion': 2018,
        'ecmaFeatures': {
            'arrowFunctions': true,
            'classes': true,
            'modules': true,
            'defaultParams': true,
            'experimentalObjectRestSpread': true
        },
        'sourceType': 'module',
        'parserOptions': {
            'allowImportExportEverywhere': true
        },
        project: 'tsconfig.json',
        tsconfigRootDir: './',
        extraFileExtensions: ['.vue'],
    },
    'globals': {
        'window': true,
        'define': true,
        'console': true,
        'require': true,
        'module': true,
    },
    'rules': {
    // 'no-var': "error",
    // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': [
            'error',
            'interface'
        ],
        '@typescript-eslint/no-unused-vars': 'error', // 使用 ts 未使用变量的规则 比如枚举类型在es中会报错
        'no-extend-native': 0,
        'no-new': 0,
        'no-var': 2,
        'prefer-const': 2,
        'no-useless-escape': 0,
        'no-useless-constructor': 0,
        'no-trailing-spaces': ['error', {'skipBlankLines': true}],
        'indent': ['error', 4, {
            'SwitchCase': 1
        }],
        'space-infix-ops': ['error', {'int32Hint': false}],
        'space-before-function-paren': ['error', {
            'anonymous': 'always',
            'named': 'always',
            'asyncArrow': 'always'
        }],
        'semi': ['error', 'always'],
        'comma-dangle': 0,
        'no-console': 0,
        'no-debugger': 0,
        'id-length': 0,
        'eol-last': 0,
        'object-curly-spacing': ['error', 'never'],
        'arrow-spacing': 'error',
        'no-multiple-empty-lines': 'error',
        'no-unused-vars': 'error',
        'spaced-comment': 'error',
        'quotes': ['error', 'single', {'allowTemplateLiterals': true}],
        'no-unreachable': 'error',
        'keyword-spacing': 'error',
        'space-before-blocks': 'error',
        'semi-spacing': 'error',
        'comma-spacing': 'error',
        'key-spacing': 'error',
        'no-undef': 'error',
        'prefer-const': ['error', {
            'destructuring': 'any',
            'ignoreReadBeforeAssign': false
        }],
        'vue/script-indent': ['warn', 4, {
            'baseIndent': 1,
            'switchCase': 1
        }],
        'vue/html-indent': ['error', 4],
        'vue/html-quotes': ['error', 'single', {'avoidEscape': true}],
        'no-restricted-syntax': 'off',
    },
    'overrides': [
        {
            'files': ['*.vue'],
            'rules': {
                'indent': 'off'
            }
        }
    ]
};