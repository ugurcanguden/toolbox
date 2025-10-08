/**
 * String manipulation and transformation utilities
 */

// Case transformations
export function toUpperCase(str: string, locale?: string): string {
  if (locale) {
    return str.toLocaleUpperCase(locale);
  }
  return str.toUpperCase();
}

export function toLowerCase(str: string, locale?: string): string {
  if (locale) {
    return str.toLocaleLowerCase(locale);
  }
  return str.toLowerCase();
}

export function toTitleCase(str: string, locale?: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    if (locale) {
      return txt.charAt(0).toLocaleUpperCase(locale) + txt.substr(1).toLocaleLowerCase(locale);
    }
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function toCamelCase(str: string, locale?: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      if (locale) {
        return index === 0 ? word.toLocaleLowerCase(locale) : word.toLocaleUpperCase(locale);
      }
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

export function toPascalCase(str: string, locale?: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      if (locale) {
        return word.toLocaleUpperCase(locale);
      }
      return word.toUpperCase();
    })
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

export function toSnakeCase(str: string, locale?: string): string {
  const result = str
    .replace(/([A-Z])/g, "_$1")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
  
  if (locale) {
    return result.toLocaleLowerCase(locale);
  }
  return result.toLowerCase();
}

export function toKebabCase(str: string, locale?: string): string {
  const result = str
    .replace(/([A-Z])/g, "-$1")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  
  if (locale) {
    return result.toLocaleLowerCase(locale);
  }
  return result.toLowerCase();
}

// Unicode and special characters
export function removeUnicode(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[^\x00-\x7F]/g, "");
}

export function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function asciiOnly(str: string): string {
  return removeUnicode(str);
}

export function removeEmoji(str: string): string {
  return str.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{FE00}-\u{FE0F}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F18E}]|[\u{3030}]|[\u{2B50}]|[\u{2B55}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23EC}]|[\u{23F0}]|[\u{23F3}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]/gu,
    ""
  );
}

export function removeSpecialChars(str: string): string {
  return str.replace(/[^a-zA-Z0-9\s]/g, "");
}

export function lettersOnly(str: string): string {
  return str.replace(/[^a-zA-Z\s]/g, "");
}

export function numbersOnly(str: string): string {
  return str.replace(/[^0-9]/g, "");
}

export function alphanumericOnly(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

// Whitespace operations
export function normalizeSpaces(str: string): string {
  return str.replace(/\s+/g, " ");
}

export function trim(str: string): string {
  return str.trim();
}

export function removeAllSpaces(str: string): string {
  return str.replace(/\s/g, "");
}

export function tabsToSpaces(str: string, spacesPerTab: number = 4): string {
  return str.replace(/\t/g, " ".repeat(spacesPerTab));
}

export function spacesToTabs(str: string, spacesPerTab: number = 4): string {
  const regex = new RegExp(" ".repeat(spacesPerTab), "g");
  return str.replace(regex, "\t");
}

// Other operations
export function removeZeroWidth(str: string): string {
  // Remove zero-width characters: zero-width space, zero-width non-joiner, zero-width joiner, etc.
  return str.replace(/[\u200B-\u200D\uFEFF]/g, "");
}

export function showInvisible(str: string): string {
  return str
    .replace(/ /g, "·")
    .replace(/\t/g, "→")
    .replace(/\n/g, "¶\n")
    .replace(/\r/g, "↵");
}

export function decodeHtmlEntities(str: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

export function encodeHtmlEntities(str: string): string {
  const textarea = document.createElement("textarea");
  textarea.textContent = str;
  return textarea.innerHTML;
}

export function reverseText(str: string): string {
  return str.split("").reverse().join("");
}

// JSON & API operations
export function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\b/g, "\\b")
    .replace(/\f/g, "\\f");
}

export function unescapeJsonString(str: string): string {
  return str
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\\/g, "\\");
}

export function urlQueryEncode(str: string): string {
  return encodeURIComponent(str);
}

export function urlQueryDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

export function formDataEncode(str: string): string {
  return encodeURIComponent(str).replace(/%20/g, "+");
}

export function formDataDecode(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g, " "));
  } catch {
    return str;
  }
}

// Statistics
export interface TextStats {
  characters: number;
  charactersWithoutSpaces: number;
  words: number;
  lines: number;
  bytes: number;
}

export function getTextStats(str: string): TextStats {
  const characters = str.length;
  const charactersWithoutSpaces = str.replace(/\s/g, "").length;
  const words = str.trim() === "" ? 0 : str.trim().split(/\s+/).length;
  const lines = str === "" ? 0 : str.split(/\r?\n/).length;
  const bytes = new Blob([str]).size;

  return {
    characters,
    charactersWithoutSpaces,
    words,
    lines,
    bytes,
  };
}
