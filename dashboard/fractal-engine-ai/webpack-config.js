const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const SERVICE_VIEW = path.resolve(__dirname, '../../service/fractal-engine-ai/')
const DASHBOARD_TEMPLATE = path.resolve(__dirname, '')
const STATIC = path.resolve(__dirname, '../../static/dashboard/fractal-engine-ai/')
const PUBLIC_STATIC = '/static/dashboard/fractal-engine-ai/dist/'

module.exports = {
    entry: path.resolve(DASHBOARD_TEMPLATE, 'index.js'),
    output: {
      filename:'[name]-[contenthash].js',
      path: path.resolve(STATIC, 'dist'),
      clean: true,
      publicPath: PUBLIC_STATIC,
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              return `vendor-${packageName.replace('@', '')}`
            },
            chunks: 'all',
          },
          fractal: {
            test: /(\/model\/)|(\/template\/)|(\/component\/)|(\/resource\/)|(\/directive\/)/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.ids.HashedModuleIdsPlugin(),
      new HtmlWebpackPlugin({
        showErrors: true,
        inject: 'body',
        // base: '/static/dist/js/',
        minify:
        {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        },
        template: path.resolve(SERVICE_VIEW, 'view', 'dashboard-template.ejs'),
        filename: path.resolve(SERVICE_VIEW, 'view', 'dashboard-index.ejs'),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
              plugins: [
                "syntax-dynamic-import"
              ]
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            plugins: [
              "syntax-dynamic-import"
            ]
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'vue-style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                esModule: false
              }
            }
          ]
        },
        {
          test: /\.ejs$/,
          loader: 'ejs-loader',
          options: {
              variable: 'data',
              interpolate : '\\{\\{(.+?)\\}\\}',
              evaluate : '\\[\\[(.+?)\\]\\]'
          },
        },
      ]
    }
}
