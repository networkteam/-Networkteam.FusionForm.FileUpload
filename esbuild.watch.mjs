import * as esbuild from 'esbuild';
import { buildOptions } from './esbuild.config.mjs';

const ctx = await esbuild.context(buildOptions);
await ctx.watch();
