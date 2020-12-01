import { resolve } from 'path';
import { merge } from 'webpack-merge';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ProjectEnv from '../env/project-env';
import commonConfig from './webpack.common';

const config: Configuration = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 2048,
        configFile: resolve(ProjectEnv.projectRoot, './src/tsconfig.json'),
      },
    }),
    new HotModuleReplacementPlugin(),
  ],
}

const devConfig = merge(commonConfig, config);

export default devConfig;
