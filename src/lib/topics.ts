import "server-only";

const TOPIC_GROUPS = [
  {
    slug: "art-net-sacn",
    label: "Art-Net & sACN",
    aliases: ["art-net", "sacn"],
  },
  {
    slug: "dmx-setup",
    label: "DMX Setup",
    aliases: ["setup", "controllers", "fixtures"],
  },
  {
    slug: "cables",
    label: "DMX Cables",
    aliases: ["cables", "cabling", "xlr", "rs-485", "termination"],
  },
  {
    slug: "protocols",
    label: "Lighting Protocols",
    aliases: ["protocol", "protocols"],
  },
  {
    slug: "dip-switch",
    label: "DMX DIP Switch",
    aliases: ["dip switch", "dip-switch"],
  },
] as const;

function normalizeTopicToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const aliasToCanonicalSlug = new Map<string, string>();
const slugToLabel = new Map<string, string>();

for (const group of TOPIC_GROUPS) {
  const canonicalSlug = normalizeTopicToken(group.slug);
  slugToLabel.set(canonicalSlug, group.label);
  aliasToCanonicalSlug.set(canonicalSlug, canonicalSlug);
  for (const alias of group.aliases) {
    aliasToCanonicalSlug.set(normalizeTopicToken(alias), canonicalSlug);
  }
}

export function topicSlugFromTag(value: string) {
  const normalized = normalizeTopicToken(value);
  if (!normalized) return "";
  return aliasToCanonicalSlug.get(normalized) ?? normalized;
}

export function topicLabelFromSlug(slug: string, fallback?: string) {
  const normalized = topicSlugFromTag(slug);
  if (!normalized) return fallback ?? "";
  return slugToLabel.get(normalized) ?? fallback ?? normalized.replace(/-/g, " ");
}

export function topicAliasesForSlug(slug: string) {
  const normalized = topicSlugFromTag(slug);
  if (!normalized) return [];

  const aliases = new Set<string>();
  aliases.add(normalized);

  for (const [alias, canonicalSlug] of aliasToCanonicalSlug.entries()) {
    if (canonicalSlug === normalized) aliases.add(alias);
  }

  return Array.from(aliases);
}
