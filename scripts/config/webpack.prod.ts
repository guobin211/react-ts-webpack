import { resolve } from 'path';
import webpack, { BannerPlugin } from 'webpack';
import { merge } from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import ProjectEnv from '../env/project-env';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import SizePlugin from 'size-plugin';

import commonConfig from './webpack.common';

const mergedConfig = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new BannerPlugin({
      raw: true,
      banner: ProjectEnv.projectName,
    }),
    new webpack.ids.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 1024 * 2,
        configFile: resolve(ProjectEnv.projectRoot, './src/tsconfig.json'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
      ignoreOrder: false,
    }),
    new CompressionPlugin({ cache: true }),
  ],
  optimization: {
    runtimeChunk: 'single',
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false }), new OptimizeCSSAssetsPlugin() as any],
  },
});

let prodConfig = mergedConfig;

/**
 * --analyze 参数构建时，会输出各个阶段的耗时和自动打开浏览器访问 bundle 分析页面
 */
if (ProjectEnv.enableAnalyze) {
  prodConfig.plugins!.push(new SizePlugin({ writeFile: false }) as any, new BundleAnalyzerPlugin());
  const smp = new SpeedMeasurePlugin();
  prodConfig = smp.wrap(mergedConfig);
}

export default prodConfig;
