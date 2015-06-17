var path = require('path');

var paths = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
};

module.exports = {
  entry: paths.src + '/plugin.js',
  output: {
    path: paths.dist,
    filename: 'jquery.cropit.js',
    library: 'cropit',
    libraryTarget: 'umd',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?blacklist[]=strict',
      },
    ],
  },

  externals: { 'jquery': 'jQuery' },
};
