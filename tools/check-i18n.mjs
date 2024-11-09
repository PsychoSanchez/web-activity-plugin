import fs from 'fs';
import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);

const manifest = require(__dirname + '/../static/manifest.json');
const defaultLocale = manifest.default_locale;

const defaultTranslations = require(
  __dirname + `/../static/_locales/${defaultLocale}/messages.json`,
);
const defaultTranslationKeys = Object.keys(defaultTranslations);
const locales = fs.readdirSync(__dirname + '/../static/_locales');

let errors = [];
locales.forEach((locale) => {
  if (locale === defaultLocale) {
    return;
  }

  const translations = require(
    __dirname + `/../static/_locales/${locale}/messages.json`,
  );

  for (const key of defaultTranslationKeys) {
    if (!translations[key]) {
      errors.push({
        locale,
        key,
      });
    }
  }
});

if (errors.length > 0) {
  console.error('Missing translations:');
  errors.forEach((error) => {
    console.error(`- ${error.locale}: ${error.key}`);
  });
  process.exit(1);
}
