const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.tsx'],
    alias: {
      '~': path.resolve(__dirname, './src'),
      dto: path.resolve(__dirname, './src/dto'),
      entity: path.resolve(__dirname, './src/entity'),
      pipe: path.resolve(__dirname, './src/pipe'),
      interceptor: path.resolve(__dirname, './src/interceptor'),
    },
    modules: ['fs', 'path', 'node_modules'],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
};
