"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type Preference = "necessary" | "analytics";

export function TrackingPreferences() {
  const [visible, setVisible] = useState(false);
  const [preference, setPreference] = useState<Preference>("necessary");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("va-consent");
    const pref: Preference = stored === "analytics" ? "analytics" : "necessary";
    setPreference(pref);
    if (pref === "necessary") {
      localStorage.setItem("va-disable", "1");
    } else {
      localStorage.removeItem("va-disable");
    }
    setVisible(true);
  }, []);

  const handleSave = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem("va-consent", preference);
    if (preference === "necessary") {
      localStorage.setItem("va-disable", "1");
    } else {
      localStorage.removeItem("va-disable");
    }
    setVisible(false);
  };

  if (!visible) return null;

  const analyticsEnabled = preference === "analytics";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-3xl flex-col gap-3 rounded-2xl bg-neutral-900 px-4 py-3 text-sm text-white shadow-[0_18px_50px_-32px_rgba(0,0,0,0.6)] ring-1 ring-neutral-800">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold text-white">Innstillinger for analyse</p>
            <p className="text-xs text-white/80">
              Standard er kun nødvendige. Aktiver analyse for anonymisert bruksmåling (Vercel Web Analytics, uten cookies).
              Du kan endre dette senere.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2 text-xs font-semibold">
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setPreference(e.target.checked ? "analytics" : "necessary")}
              className="h-4 w-4 rounded border-neutral-400 text-neutral-900"
            />
            Slå på analyse
          </label>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setPreference("necessary");
                handleSave();
              }}
              className="rounded-full bg-white px-3 py-1 text-neutral-900 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
            >
              Bare nødvendige
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={clsx(
                "rounded-full px-3 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white",
                analyticsEnabled ? "bg-white text-neutral-900 hover:bg-neutral-100" : "bg-neutral-800 text-white hover:bg-neutral-700",
              )}
            >
              Lagre valg
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
