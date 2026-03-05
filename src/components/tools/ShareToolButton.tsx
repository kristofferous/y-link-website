"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

type CopyState = "idle" | "copied" | "error";

function buildShortUrl(): string {
  const pathAndSearch = window.location.pathname + window.location.search;
  const base64 = btoa(unescape(encodeURIComponent(pathAndSearch)));
  const code = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return `${window.location.origin}/s/${code}`;
}

export function ShareToolButton({ className }: { className?: string }) {
  const { dictionary } = useTranslations();
  const t = dictionary.tools.shareButton;
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyShortLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShortUrl());
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const shareShortLink = async () => {
    try {
      await navigator.share({ url: buildShortUrl() });
    } catch {
      // User cancelled or API unavailable
    }
  };

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      <Button type="button" variant="outline" size="sm" onClick={copyShortLink}>
        {copyState === "copied" ? t.copied : copyState === "error" ? t.error : t.copyLink}
      </Button>
      {canShare ? (
        <Button type="button" variant="ghost" size="sm" onClick={shareShortLink}>
          {t.share}
        </Button>
      ) : null}
    </div>
  );
}
