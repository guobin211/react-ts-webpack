import path from 'path';
import { argv } from 'yargs';
import packages from '../../package.json';

const Env = {
  isDevMode: process.env.NODE_ENV !== 'production',
  enableAnalyze: !!argv.analyze,
  enableOpen: argv.open as true | string,
  host: '127.0.0.1',
  port: 8080,
  projectRoot: path.resolve(__dirname, '../../'),
  projectName: packages.name,
  hmrPath: '/__webpack_hmr',
};

const ProjectEnv: Readonly<typeof Env> = Env;

export default ProjectEnv;


