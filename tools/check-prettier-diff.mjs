// Check prettier only on changed files
import { execSync } from 'child_process';

const changedFiles = execSync('git diff --name-only HEAD')
  .toString()
  .split('\n');

const EXTENSIONS = ['js', 'mjs', 'ts', 'tsx'];
const prettierFiles = changedFiles.filter((file) =>
  EXTENSIONS.some((ext) => file.endsWith(ext)),
);

if (prettierFiles.length > 0) {
  try {
    execSync(
      `npx prettier --ignore-path .gitignore --check ${prettierFiles.join(' ')}`,
    );
  } catch (error) {
    console.error('Prettier check failed');
    process.exit(1);
  }
}
