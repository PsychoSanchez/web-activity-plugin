const cssModulesPlugin = require('esbuild-plugin-css-modules');
const chokidar = require('chokidar');
const esBuild = require('esbuild');
const fs = require('fs');

const OUTPUT_DIR = './dist/';
const STATIC_DIR = './static/';

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

const createStaticFileWatcher = () => {
  if (!isDevelopment) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const watcher = chokidar.watch(STATIC_DIR, {
      ignored: /^\./,
      persistent: true,
    });

    watcher.on('ready', resolve).on('error', reject);

    const getTargetStaticPath = (staticFilePath) => {
      const pathArray = staticFilePath.split('\\');
      pathArray[0] = 'dist';
      const targetFilePath = pathArray.join('\\');

      return targetFilePath;
    };

    const copyFileToOutputFolder = (staticFilePath) => {
      const targetFilePath = getTargetStaticPath(staticFilePath);

      fs.copyFile(staticFilePath, targetFilePath, (err) => {
        if (err) {
          return console.error(err);
        }

        console.log(staticFilePath, 'was copied to', targetFilePath);
      });
    };

    watcher
      .on('add', copyFileToOutputFolder)
      .on('change', copyFileToOutputFolder)
      .on('unlink', (staticFilePath) => {
        const targetFilePath = getTargetStaticPath(staticFilePath);
        fs.unlinkSync(targetFilePath);
        console.log('File', targetFilePath, 'has been removed');
      });
  });
};

const staticFilesWatcher = createStaticFileWatcher();

Promise.all([esBuildPromise, staticFilesWatcher]).catch(() => process.exit(1));
