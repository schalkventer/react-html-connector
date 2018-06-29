const { resolve } = require('path');


const transpileJs = {
  test: /\.js$/,
  loader: 'babel-loader',
};


module.exports = {
  entry: './src/index.js',

  output: {
    path: resolve(__dirname, './../../dist'),
    library: 'ReactHtmlConnector',
    libraryTarget: 'umd',
  },

  module: {
    rules: [transpileJs],
  },
};
