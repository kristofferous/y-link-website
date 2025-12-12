"use client";

import { Analytics } from "@vercel/analytics/react";

export function AnalyticsWrapper() {
  return (
    <Analytics
      beforeSend={(event) => {
        if (typeof window !== "undefined" && localStorage.getItem("va-disable")) {
          return null;
        }
        try {
          const url = new URL(event.url);
          ["token", "code", "session", "state", "email", "userId"].forEach((key) => url.searchParams.delete(key));
          event.url = url.toString();
        } catch {
          // ignore malformed URLs
        }
        return event;
      }}
    />
  );
}
