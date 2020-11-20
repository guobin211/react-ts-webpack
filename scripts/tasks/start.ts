import chalk from 'chalk';
import logSymbols from 'log-symbols';
import express from 'express';
import webpack from 'webpack';
import WebpackOpenBrowser from 'webpack-open-browser';
import devConfig from '../config/webpack.dev';
import { getPort } from '../env/get-port';
import ProjectEnv from '../env/project-env';
import setupMiddleware from '../middlewares';


async function start() {
  const PORT = await getPort(ProjectEnv.host, ProjectEnv.port);
  const address = `http://${ProjectEnv.host}:${PORT}`;
  /**
   * enableOpen 参数值可能是 true 或者是一个指定的 URL
   */
  if (ProjectEnv.enableOpen) {
    let openAddress = ProjectEnv.enableOpen as string;
    if (ProjectEnv.enableOpen === true) {
      openAddress = address;
      let publicPath = devConfig.output?.publicPath as string;
      // 未设置和空串都视为根路径
      publicPath = publicPath == null || publicPath === '' ? '/' : publicPath;
      if (publicPath !== '/') {
        // 要注意处理没有带 '/' 前缀和后缀的情况
        openAddress = `${address}${publicPath.startsWith('/') ? '' : '/'}${publicPath}${
            publicPath.endsWith('/') ? '' : '/'
        }index.html`;
      }
    }
    devConfig.plugins!.push(new WebpackOpenBrowser({ url: openAddress }));
  }

  const devServer = express();
  /**
   *  加载 webpack 配置，获取 compiler
   */
  const compiler = webpack(devConfig);
  setupMiddleware(devServer, compiler);

  const httpServer = devServer.listen(PORT, ProjectEnv.host, 0, () => {
    console.log(
        `DevServer is running at ${chalk.magenta.underline(address)} ${logSymbols.success}`,
    );
  });

  /**
   * 使用 cross-env
   * 参考：https://github.com/kentcdodds/cross-env#cross-env-vs-cross-env-shell
   */
  ['SIGINT', 'SIGTERM'].forEach((signal: any) => {
    process.on(signal, () => {
      httpServer.close();
      console.log(
          chalk.greenBright.bold(`\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`),
      );
      process.exit();
    });
  });
}

if (require.main === module) {
  start().then();
}
