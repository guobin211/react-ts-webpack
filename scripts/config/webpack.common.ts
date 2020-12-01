import { resolve } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
// import WebpackBuildNotifierPlugin from 'webpack-build-notifier';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// @ts-ignore
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Options as HtmlMinifierOptions } from 'html-minifier';
import CopyPlugin from 'copy-webpack-plugin';
import { loader as MiniCssExtractLoader } from 'mini-css-extract-plugin';
import ProjectEnv from '../env/project-env';

/**
 * css loader
 * @param importLoaders
 */
function getCssLoaders(importLoaders: number) {
  return [
    ProjectEnv.isDevMode ? 'style-loader' : MiniCssExtractLoader,
    {
      loader: 'css-loader',
      options: {
        modules: false,
        sourceMap: true,
        importLoaders,
      },
    },
    {
      loader: 'postcss-loader',
      options: { sourceMap: true },
    },
  ];
}

/**
 * index.html 压缩选项
 */
//@ts-ignore
const htmlMinifyOptions: HtmlMinifierOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
};

const commonConfig: Configuration = {
  cache: true,
  context: ProjectEnv.projectRoot,
  entry: ['react-hot-loader/patch', resolve(ProjectEnv.projectRoot, './src/index.tsx')],
  output: {
    publicPath: '/',
    path: resolve(ProjectEnv.projectRoot, './dist'),
    filename: 'js/[name]-[contenthash].bundle.js',
    hashSalt: ProjectEnv.projectName,
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts', '.json'],
    alias: {
      // // 替换 react-dom 成 @hot-loader/react-dom 以支持 react hooks 的 hot reload
      'react-dom': '@hot-loader/react-dom',
      '@': resolve(ProjectEnv.projectRoot, './src'),
    },
  },
  plugins: [
    new WebpackBar({
      name: ProjectEnv.projectName,
      color: '#61dafb',
    }),
    new FriendlyErrorsPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(Object.assign(
        {},
        {
          inject: true,
          template: resolve(ProjectEnv.projectRoot, './public/index.html'),
        },
        ProjectEnv.isDevMode ? undefined : { minify: htmlMinifyOptions}
        ),
    ),
    new CopyPlugin({
      patterns: [
        {
          context: resolve(ProjectEnv.projectRoot, './public'),
          from: '*',
          to: resolve(ProjectEnv.projectRoot, './dist'),
          toType: 'dir',
          globOptions: {
            ignore: ['index.html'],
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getCssLoaders(0),
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              name: '[name].[contenthash].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[contenthash].[ext]',
              outputPath: 'fonts',
            },
          },
        ],
      },
    ],
  },
};

if (ProjectEnv.isDevMode) {
  // reload=true 设置 webpack 无法热更新时刷新整个页面，overlay=true 设置编译出错时在网页中显示出错信息遮罩
  if (Array.isArray(commonConfig.entry)) {
    commonConfig.entry.unshift(
        `webpack-hot-middleware/client?path=${ProjectEnv.hmrPath}&reload=true&overlay=true`,
    );
  }
}

export default commonConfig;
