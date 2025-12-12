"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import { subscribeAction, type SubscriptionFormState } from "@/app/actions";
import { interestOptions } from "@/lib/interest";
import { guardText } from "@/lib/guardrails";

type Variant = "hero" | "cta" | "footer" | "modal";

type InterestSignupProps = {
  variant?: Variant;
  title?: string;
  description?: string;
  ctaLabel?: string;
  contextSource?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  onClose?: () => void;
  id?: string;
};

type Tracking = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  pathname?: string;
  timestamp?: string;
};

const initialState: SubscriptionFormState = {
  status: "idle",
  message: "",
};

function trackEvent(name: string, detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const payload = { name, detail, ts: new Date().toISOString() };
  if (typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new CustomEvent(name, { detail: payload }));
  }
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({ event: name, ...payload });
  }
  // Fallback log to aid debugging without analytics configured.
  // eslint-disable-next-line no-console
  console.debug("[tracking]", payload);
}

export function InterestSignup({
  variant = "hero",
  title,
  description,
  ctaLabel = "Meld interesse",
  contextSource,
  secondaryCtaHref = "/ai-dmx-controller",
  secondaryCtaLabel = "Les hvordan det fungerer",
  onClose,
  id,
}: InterestSignupProps) {
  const [state, formAction] = useActionState(subscribeAction, initialState);
  const [showDetails, setShowDetails] = useState(false);
  const [tracking, setTracking] = useState<Tracking>({
    pathname: "",
    referrer: "",
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const getParam = (key: string) => url.searchParams.get(key) ?? undefined;
    setTracking({
      utm_source: getParam("utm_source"),
      utm_medium: getParam("utm_medium"),
      utm_campaign: getParam("utm_campaign"),
      utm_term: getParam("utm_term"),
      utm_content: getParam("utm_content"),
      referrer: document.referrer || undefined,
      pathname: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("signup_success", { context: contextSource ?? variant });
    }
  }, [state.status, contextSource, variant]);

  const containerClasses = useMemo(() => {
    if (variant === "hero") {
      return "w-full rounded-3xl bg-white/90 p-6 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.35)] ring-1 ring-neutral-200 backdrop-blur";
    }
    if (variant === "cta") {
      return "w-full rounded-3xl bg-white p-6 text-neutral-900 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.35)] ring-1 ring-neutral-200";
    }
    if (variant === "footer") {
      return "w-full rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-neutral-200";
    }
    return "w-full";
  }, [variant]);

  const safeTitle = guardText(title ?? "Få tidlig tilgang til Y-Link", "InterestSignup.title", 120);
  const safeDescription = guardText(
    description ??
      "Meld interesse – få oppdateringer og pilotinvitasjon når vi åpner neste runde.",
    "InterestSignup.description",
    180,
  );

  const labelClass = "block text-sm font-semibold text-neutral-900";

  const formBody = (
    <form
      id={id}
      action={(formData) => {
        trackEvent("signup_submit", { context: contextSource ?? variant });
        return formAction(formData);
      }}
      className="space-y-5"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <label
            htmlFor={`email-${variant}-${id ?? ""}`}
            className={labelClass}
          >
            E-post
          </label>
          <input
            id={`email-${variant}-${id ?? ""}`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            placeholder="navn@domene.no"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`role-${variant}-${id ?? ""}`}
            className={labelClass}
          >
            Hva beskriver deg best? (valgfritt)
          </label>
          <select
            id={`role-${variant}-${id ?? ""}`}
            name="role"
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            defaultValue=""
          >
            <option value="">Velg ett</option>
            <option value="Venue">Venue</option>
            <option value="DJ">DJ</option>
            <option value="Lysoperatør">Lysoperatør</option>
            <option value="Utleie">Utleie</option>
            <option value="Russebuss">Russebuss</option>
            <option value="Annet">Annet</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`dmx-${variant}-${id ?? ""}`}
            className={labelClass}
          >
            DMX-oppsett (valgfritt)
          </label>
          <input
            id={`dmx-${variant}-${id ?? ""}`}
            name="dmx_setup"
            type="text"
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            placeholder="Antall universer, fixtures, osv."
          />
        </div>

        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-sm font-semibold text-neutral-900 underline underline-offset-4"
          style={variant === "cta" ? { color: "white" } : undefined}
        >
          Flere detaljer (valgfritt)
        </button>
        {showDetails ? (
          <div className="space-y-3 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/70 p-3">
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor={`name-${variant}-${id ?? ""}`}>
                Navn (valgfritt)
              </label>
              <input
                id={`name-${variant}-${id ?? ""}`}
                name="name"
                type="text"
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                placeholder="Navn"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor={`notes-${variant}-${id ?? ""}`}>
                Andre detaljer (valgfritt)
              </label>
              <textarea
                id={`notes-${variant}-${id ?? ""}`}
                name="notes"
                rows={3}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                placeholder="Behov, tidslinje, særskilte krav"
              />
            </div>
          </div>
        ) : null}
      </div>

      <input type="hidden" name="interest_type" value={interestOptions[0]} />
      <input type="hidden" name="context_source" value={contextSource ?? variant} />
      <input type="hidden" name="utm_source" value={tracking.utm_source ?? ""} />
      <input type="hidden" name="utm_medium" value={tracking.utm_medium ?? ""} />
      <input type="hidden" name="utm_campaign" value={tracking.utm_campaign ?? ""} />
      <input type="hidden" name="utm_term" value={tracking.utm_term ?? ""} />
      <input type="hidden" name="utm_content" value={tracking.utm_content ?? ""} />
      <input type="hidden" name="referrer" value={tracking.referrer ?? ""} />
      <input type="hidden" name="pathname" value={tracking.pathname ?? ""} />
      <input type="hidden" name="timestamp" value={tracking.timestamp ?? ""} />

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          onClick={() => trackEvent("cta_click", { context: contextSource ?? variant })}
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
        >
          {ctaLabel}
        </button>
        {state.message ? (
          <div
            className={clsx(
              "rounded-xl px-3 py-2 text-sm",
              state.status === "success"
                ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                : "bg-red-50 text-red-800 ring-1 ring-red-100",
            )}
          >
            {state.status === "success"
              ? "Takk! Du er på lista. Vi tar kontakt når pilot åpner."
              : state.message}
          </div>
        ) : null}
        {state.status === "success" ? (
          <Link
            href={secondaryCtaHref}
            className="text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
          >
            {secondaryCtaLabel}
          </Link>
        ) : (
          <p className="text-xs text-neutral-700">
            Pilotinvitasjon + oppdateringer. Du kan melde deg av når som helst.
          </p>
        )}
      </div>
    </form>
  );

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="label-text text-xs font-semibold text-neutral-700">
                Bli med i pilotkøen – vi tar kontakt
              </p>
              <h2 className="text-xl font-semibold text-neutral-900">
                Få tidlig tilgang til Y-Link
              </h2>
              <p className="text-sm text-neutral-800">
                Meld interesse, så følger vi opp med piloter og oppdateringer.
              </p>
            </div>
            <button
              aria-label="Lukk"
              onClick={onClose}
              className="rounded-full p-2 text-neutral-700 transition hover:bg-neutral-100"
            >
              ×
            </button>
          </div>
          {formBody}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} id={id}>
      <div className="space-y-2">
        <p
            className={clsx(
            "text-xs font-semibold label-text",
            variant === "cta" ? "text-neutral-700" : "text-neutral-700",
          )}
        >
          {safeTitle}
        </p>
        {description ? (
          <p className={clsx("text-sm", variant === "cta" ? "text-neutral-800" : "text-neutral-800", "clamp-3")}>
            {safeDescription}
          </p>
        ) : (
          <p className={clsx("text-sm", variant === "cta" ? "text-neutral-800" : "text-neutral-800", "clamp-3")}>
            {safeDescription}
          </p>
        )}
      </div>
      <div className={variant === "footer" ? "mt-3" : "mt-5"}>{formBody}</div>
    </div>
  );
}
