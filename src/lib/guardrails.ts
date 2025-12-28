export function guardText(text: string | undefined, label: string, maxChars: number) {
  if (!text) return "";
  if (process.env.NODE_ENV !== "production" && text.length > maxChars) {
    console.warn(`[guardrails] ${label} exceeds ${maxChars} chars, truncating`);
  }
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text;
}
