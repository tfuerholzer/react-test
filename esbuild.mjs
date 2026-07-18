import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import fs from 'node:fs';
import path from 'node:path';

const serve = process.argv.includes('--serve');
const outdir = 'dist';

// Make sure the output dir exists and ship the static HTML shell into it.
fs.mkdirSync(outdir, { recursive: true });
fs.copyFileSync('public/index.html', path.join(outdir, 'index.html'));

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outdir,
  format: 'esm',
  sourcemap: true,
  minify: !serve,
  target: ['es2020'],
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
  },
  plugins: [sassPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(serve ? 'development' : 'production'),
  },
};

if (serve) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: outdir, port: 3000 });
  console.log(`\n  ⚡ Dev server running at http://localhost:${port}\n`);
} else {
  await esbuild.build(options);
  console.log('✓ Build complete → dist/');
}
