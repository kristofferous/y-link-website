import { readFileSync } from "node:fs";
import { join } from "node:path";

const localesDir = join(process.cwd(), "locales");
const nb = JSON.parse(readFileSync(join(localesDir, "nb-NO.json"), "utf8"));
const en = JSON.parse(readFileSync(join(localesDir, "en-US.json"), "utf8"));

function flattenKeys(value, prefix = "") {
  if (typeof value !== "object" || value === null) {
    return [prefix];
  }

  if (Array.isArray(value)) {
    const keys = [];
    value.forEach((item, index) => {
      keys.push(...flattenKeys(item, `${prefix}[${index}]`));
    });
    return keys;
  }

  const keys = [];
  for (const key of Object.keys(value)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    keys.push(...flattenKeys(value[key], nextPrefix));
  }
  return keys;
}

function diffKeys(base, compare) {
  const baseKeys = new Set(flattenKeys(base));
  const compareKeys = new Set(flattenKeys(compare));

  const missingInCompare = [...baseKeys].filter((key) => !compareKeys.has(key));
  const missingInBase = [...compareKeys].filter((key) => !baseKeys.has(key));

  return { missingInCompare, missingInBase };
}

const { missingInCompare, missingInBase } = diffKeys(nb, en);

if (missingInCompare.length || missingInBase.length) {
  console.error("Translation key mismatch detected:");
  if (missingInCompare.length) {
    console.error("Keys missing in en-US.json:", missingInCompare.join(", "));
  }
  if (missingInBase.length) {
    console.error("Keys missing in nb-NO.json:", missingInBase.join(", "));
  }
  process.exit(1);
}

console.log("Translation keys are in sync across locales.");
