var webpack = require('webpack');
var path = require('path');

var pkg = require('./cropit.jquery.json');

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

  externals: {
    jquery: {
      root: 'jQuery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery',
    },
  },

  plugins: [
    new webpack.BannerPlugin(pkg.name + ' - v' + pkg.version +
      ' <' +pkg.homepage + '>'),
  ],
};
