const base = require('./base');

module.exports = {
  ...base,
  mode: 'development',
  output: {
    ...base.output,
    filename: 'index.dev.js',
  },
};
