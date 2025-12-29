"use client";

import { useMemo, useState } from "react";

export type FaqListItem = {
  id: string;
  question: string;
  answerHtml: string;
};

type FaqListProps = {
  items: FaqListItem[];
  searchLabel: string;
  searchPlaceholder: string;
  emptyLabel: string;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function FaqList({ items, searchLabel, searchPlaceholder, emptyLabel }: FaqListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return items;
    return items.filter((item) => {
      const text = `${item.question} ${stripHtml(item.answerHtml)}`.toLowerCase();
      return text.includes(trimmed);
    });
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground" htmlFor="faq-search">
          {searchLabel}
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-md border border-border/60 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border/40 bg-card p-6 text-sm text-muted-foreground">{emptyLabel}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <details key={item.id} className="rounded-lg border border-border/40 bg-card p-6">
              <summary className="cursor-pointer text-title text-foreground marker:text-muted-foreground">
                {item.question}
              </summary>
              <div
                className="content-html mt-3 text-body text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: item.answerHtml }}
              />
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
