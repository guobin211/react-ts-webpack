import { Compiler } from 'webpack';
import { Express } from 'express';
import historyFallback from 'connect-history-api-fallback';
import cors from 'cors';
import proxyMiddleware from './proxy.middle';
import webpackMiddleware from './webpack.middle';

/**
 * 配置中间件
 */
export default function setupMiddleware(server: Express, compiler: Compiler): void {
  proxyMiddleware(server);
  server.use(historyFallback());
  server.use(cors());
  server.use(webpackMiddleware(compiler));
}
