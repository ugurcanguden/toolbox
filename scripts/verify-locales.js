// verify-locales.js
// Checks that all locale JSON files have the same key set as the merged source (en + tr).
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'i18n', 'locales');
const sourceFiles = ['en.json', 'tr.json'];
const targetLocales = ['de', 'es', 'fr', 'it', 'ja', 'nl', 'pt', 'ru'];

function load(file) { return JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8')); }
function getAllPaths(obj, prefix = '') {
  let paths = [];
  for (const key in obj) {
    const val = obj[key];
    const cur = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      paths = paths.concat(getAllPaths(val, cur));
    } else {
      paths.push(cur);
    }
  }
  return paths;
}

// Merge en and tr (tr overrides en)
const en = load('en.json');
const tr = load('tr.json');
function deepMerge(target, source) {
  for (const k in source) {
    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
      if (!target[k]) target[k] = {};
      deepMerge(target[k], source[k]);
    } else {
      target[k] = source[k];
    }
  }
}
const sourceMerged = JSON.parse(JSON.stringify(en));
deepMerge(sourceMerged, tr);
const sourcePaths = new Set(getAllPaths(sourceMerged));

let hasError = false;
for (const locale of targetLocales) {
  const file = `${locale}.json`;
  if (!fs.existsSync(path.join(localesDir, file))) {
    console.log(`⚠️  ${file} does not exist`);
    hasError = true;
    continue;
  }
  const data = load(file);
  const paths = new Set(getAllPaths(data));
  const missing = [...sourcePaths].filter(p => !paths.has(p));
  if (missing.length) {
    console.log(`❌ ${file} is missing ${missing.length} keys:`);
    missing.forEach(k => console.log('  -', k));
    hasError = true;
  } else {
    console.log(`✅ ${file} has all keys`);
  }
}
process.exit(hasError ? 1 : 0);
