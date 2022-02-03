const chokidar = require('chokidar');
const fs = require('fs');
const PATH_SEPARATOR = require('path').sep;

const createStaticFileWatcher = ({ sourceFolder, destinationFolder }) => {
  return new Promise((resolve, reject) => {
    const watcher = chokidar.watch(sourceFolder, {
      ignored: /^\./,
      persistent: true,
    });

    watcher.on('ready', resolve).on('error', reject);

    const getTargetStaticPath = (staticFilePath) => {
      const pathArray = staticFilePath.split(PATH_SEPARATOR);
      pathArray[0] = destinationFolder;
      const targetFilePath = pathArray.join(PATH_SEPARATOR);

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

module.exports = createStaticFileWatcher;
