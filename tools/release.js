const fs = require('fs');

// Update manifest.json to package.json version
const manifest = require(__dirname + '/../static/manifest.json');
const pkg = require(__dirname + '/../package.json');
manifest.version = pkg.version;
fs.writeFileSync(
  __dirname + '/../static/manifest.json',
  JSON.stringify(manifest, null, 2),
);
