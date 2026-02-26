// sync-locales.js
// This script synchronizes locale JSON files in the Free Dev Tools project.
// Fallback source: en.json only (missing keys get English placeholder text).
// Target locales: de, es, fr, it, ja, nl, pt, ru.

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'i18n', 'locales');
const targetLocales = ['de', 'es', 'fr', 'it', 'ja', 'nl', 'pt', 'ru'];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveJson(file, data) {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(file, content + '\n', 'utf8');
}

function getAllKeyPaths(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const value = obj[key];
    const currentPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getAllKeyPaths(value, currentPath));
    } else {
      keys.push(currentPath);
    }
  }
  return keys;
}

function setValueAtPath(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!cur[part] || typeof cur[part] !== 'object') {
      cur[part] = {};
    }
    cur = cur[part];
  }
  cur[parts[parts.length - 1]] = value;
}

function getValueAtPath(obj, pathStr) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in cur) {
      cur = cur[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

/**
 * For each key in enData, if it is missing from targetData, insert the English value.
 * Existing translated values in targetData are preserved as-is.
 */
function syncLocale(enData, targetData) {
  const keyPaths = getAllKeyPaths(enData);
  for (const keyPath of keyPaths) {
    const targetVal = getValueAtPath(targetData, keyPath);
    if (targetVal === undefined) {
      const enVal = getValueAtPath(enData, keyPath);
      setValueAtPath(targetData, keyPath, enVal);
    }
  }
  return targetData;
}

function main() {
  // Only en.json is used as the fallback — so missing keys appear in English, not Turkish.
  const enData = loadJson(path.join(localesDir, 'en.json'));

  for (const locale of targetLocales) {
    const filePath = path.join(localesDir, `${locale}.json`);
    let targetData = {};
    if (fs.existsSync(filePath)) {
      targetData = loadJson(filePath);
    }
    const updated = syncLocale(enData, targetData);
    saveJson(filePath, updated);
    console.log(`Synced ${locale}.json`);
  }
}

main();
