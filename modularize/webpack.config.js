var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js',
    vendor: ['underscore'],
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.js')
  ]
};
