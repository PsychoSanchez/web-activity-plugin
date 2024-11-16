import fs from 'fs';
import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Update manifest.json to package.json version
const manifest = require(__dirname + '/../static/manifest.json');
const pkg = require(__dirname + '/../package.json');
manifest.version = pkg.version;
fs.writeFileSync(
  __dirname + '/../static/manifest.json',
  JSON.stringify(manifest, null, 2),
);
