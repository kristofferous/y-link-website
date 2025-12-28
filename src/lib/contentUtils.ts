const DESCRIPTION_MAX = 180;

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function buildDescription(summary: string | null, contentHtml: string, maxLength = DESCRIPTION_MAX) {
  if (summary) return summary;
  const plain = stripHtml(contentHtml);
  return plain.length > maxLength ? `${plain.slice(0, maxLength).trim()}...` : plain;
}
