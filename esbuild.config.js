const cssModulesPlugin = require('esbuild-plugin-css-modules');
const esBuild = require('esbuild');
const createStaticFileWatcher = require('./build-tools/copy-static');

const OUTPUT_FOLDER = 'dist';
const OUTPUT_DIR = `./${OUTPUT_FOLDER}/`;
const isDevelopment = process.env.NODE_ENV === 'development';

const esBuildPromise = esBuild.build({
  entryPoints: [
    './src/background.index.ts',
    './src/content.index.tsx',
    './src/popup.index.tsx',
  ],
  bundle: true,
  write: true,
  minify: !isDevelopment,
  watch: isDevelopment,
  platform: 'browser',
  target: ['chrome58'],
  outdir: OUTPUT_DIR,
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  },
  plugins: [
    // cssModulesPlugin(),
    cssModulesPlugin({
      localIdentName: '[local]__[hash:8:md5:hex]',
    }),
  ],
});

const staticFilesWatcher = isDevelopment
  ? createStaticFileWatcher({
      sourceFolder: 'static',
      destinationFolder: OUTPUT_FOLDER,
    })
  : Promise.resolve();

Promise.all([esBuildPromise, staticFilesWatcher]).catch(() => process.exit(1));
