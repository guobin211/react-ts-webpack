import webpack from 'webpack';
import prodConfig from '../config/webpack.prod';
import ProjectEnv from '../env/project-env';

const compiler = webpack(prodConfig);

compiler.run((error, stats) => {
  if (error) {
    console.error(error);
    return;
  }

  const analyzeStatsOpts = {
    preset: 'normal',
    colors: true,
  };

  console.log(stats?.toString(ProjectEnv.enableAnalyze ? analyzeStatsOpts : 'minimal'));
});
