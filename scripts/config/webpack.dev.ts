import { resolve } from 'path';
import { merge } from 'webpack-merge';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ProjectEnv from '../env/project-env';
import commonConfig from './webpack.common';

const config: Configuration = {
  mode: 'development',
  // [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
  devtool: 'source-map',
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 1024,
        configFile: resolve(ProjectEnv.projectRoot, './src/tsconfig.json'),
      },
    }),
    new HotModuleReplacementPlugin(),
  ],
}

const devConfig = merge(commonConfig, config);

export default devConfig;
