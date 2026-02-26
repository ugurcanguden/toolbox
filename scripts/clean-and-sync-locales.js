// clean-and-sync-locales.js
// Removes Turkish (tr) values that were wrongly inserted into non-Turkish locale files
// by the previous sync run, then re-inserts English (en) fallbacks for any missing keys.

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'i18n', 'locales');
const targetLocales = ['de', 'es', 'fr', 'it', 'ja', 'nl', 'pt', 'ru'];

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
}

function save(locale, data) {
  fs.writeFileSync(
    path.join(localesDir, `${locale}.json`),
    JSON.stringify(data, null, 2) + '\n',
    'utf8'
  );
}

function getAllKeyPaths(obj, prefix = '') {
  let paths = [];
  for (const key in obj) {
    const val = obj[key];
    const cur = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      paths = paths.concat(getAllKeyPaths(val, cur));
    } else {
      paths.push(cur);
    }
  }
  return paths;
}

function get(obj, pathStr) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in cur) cur = cur[part];
    else return undefined;
  }
  return cur;
}

function set(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!cur[part] || typeof cur[part] !== 'object') cur[part] = {};
    cur = cur[part];
  }
  cur[parts[parts.length - 1]] = value;
}

function jsonEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function main() {
  const enData = load('en.json');
  const trData = load('tr.json');
  const enPaths = getAllKeyPaths(enData);

  for (const locale of targetLocales) {
    const target = load(`${locale}.json`);
    let cleaned = 0;
    let added = 0;

    for (const p of enPaths) {
      const targetVal = get(target, p);
      const trVal    = get(trData, p);
      const enVal    = get(enData, p);

      if (targetVal === undefined) {
        // Missing key → insert English fallback
        set(target, p, enVal);
        added++;
      } else if (trVal !== undefined && jsonEqual(targetVal, trVal) && !jsonEqual(enVal, trVal)) {
        // Value matches Turkish (and differs from English) → replace with English fallback
        set(target, p, enVal);
        cleaned++;
      }
      // Otherwise keep existing translated value
    }

    save(locale, target);
    console.log(`${locale}.json — cleaned ${cleaned} Turkish values, added ${added} missing keys`);
  }
}

main();
