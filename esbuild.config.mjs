import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import postCssPlugin from 'esbuild-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export const buildOptions = {
  entryPoints: ['Resources/Private/Javascript/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: 'Resources/Public/Dist',
  plugins: [
    sassPlugin(),
    postCssPlugin({
      plugins: [autoprefixer(), cssnano()],
      extract: true,
      minimize: true,
    }),
  ],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
  },
};

esbuild.build(buildOptions).catch(() => process.exit(1));
