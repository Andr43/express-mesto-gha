module.exports = {
  env: {
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [
  ],
  rules: {
    'no-underscore-dangle': [
      'error',
      {
        // eslint-disable-next-line quote-props
        'allow': [
          '_id',
        ],
      },
    ],
  },
};
