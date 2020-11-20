import { Compiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import devConfig from '../config/webpack.dev';
import ProjectEnv from '../env/project-env';

export default function webpackMiddleware(compiler: Compiler) {
  const publicPath = devConfig.output!.publicPath! as string;

  const devMiddlewareOptions: webpackDevMiddleware.Options = {
    publicPath,
    writeToDisk: false
  };

  const hotMiddlewareOptions: webpackHotMiddleware.MiddlewareOptions = {
    path: ProjectEnv.hmrPath,
  };

  return [
    webpackDevMiddleware(compiler, devMiddlewareOptions),
    webpackHotMiddleware(compiler, hotMiddlewareOptions),
  ];
}
