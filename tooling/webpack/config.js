const base = require('./base');
const { loader } = require('webpack-strip');


const removePropTypeValidation = {
  test: /\.js$/,
  loader: loader('checkPropTypes'),
};


module.exports = {
  ...base,
  mode: 'production',
  output: {
    ...base.output,
    filename: 'index.min.js',
  },

  module: {
    rules: [
      ...base.module.rules,
      removePropTypeValidation,
    ],
  },
};
