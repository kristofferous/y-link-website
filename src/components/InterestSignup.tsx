"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import clsx from "clsx"

import { subscribeAction, type SubscriptionFormState } from "@/app/actions"
import { interestOptions } from "@/lib/interest"
import { guardText } from "@/lib/guardrails"

type Variant = "hero" | "cta" | "footer" | "modal"

type InterestSignupProps = {
  variant?: Variant
  title?: string
  description?: string
  ctaLabel?: string
  contextSource?: string
  secondaryCtaHref?: string
  secondaryCtaLabel?: string
  onClose?: () => void
  id?: string
}

type Tracking = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  pathname?: string
  timestamp?: string
}

const initialState: SubscriptionFormState = {
  status: "idle",
  message: "",
}

function trackEvent(name: string, detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return
  const payload = { name, detail, ts: new Date().toISOString() }
  if (typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new CustomEvent(name, { detail: payload }))
  }
  if ((window as any).dataLayer) {
    ;(window as any).dataLayer.push({ event: name, ...payload })
  }
  console.debug("[tracking]", payload)
}

export function InterestSignup({
  variant = "hero",
  title,
  description,
  ctaLabel = "Express Interest",
  contextSource,
  secondaryCtaHref = "/ai-dmx-controller",
  secondaryCtaLabel = "Learn how it works",
  onClose,
  id,
}: InterestSignupProps) {
  const [state, formAction] = useActionState(subscribeAction, initialState)
  const [showDetails, setShowDetails] = useState(false)
  const [tracking, setTracking] = useState<Tracking>({
    pathname: "",
    referrer: "",
    timestamp: new Date().toISOString(),
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    const getParam = (key: string) => url.searchParams.get(key) ?? undefined
    setTracking({
      utm_source: getParam("utm_source"),
      utm_medium: getParam("utm_medium"),
      utm_campaign: getParam("utm_campaign"),
      utm_term: getParam("utm_term"),
      utm_content: getParam("utm_content"),
      referrer: document.referrer || undefined,
      pathname: window.location.pathname,
      timestamp: new Date().toISOString(),
    })
  }, [])

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("signup_success", { context: contextSource ?? variant })
    }
  }, [state.status, contextSource, variant])

  const containerClasses = useMemo(() => {
    if (variant === "hero") {
      return "w-full rounded-xl border border-border/40 bg-card p-6"
    }
    if (variant === "cta") {
      return "w-full rounded-xl border border-border/40 bg-card p-6"
    }
    if (variant === "footer") {
      return "w-full rounded-lg border border-border/40 bg-card p-4"
    }
    return "w-full"
  }, [variant])

  const safeTitle = guardText(title ?? "Get Early Access to Y-Link", "InterestSignup.title", 120)
  const safeDescription = guardText(
    description ?? "Express interest - get updates and pilot invitation when we open the next round.",
    "InterestSignup.description",
    180,
  )

  const labelClass = "block text-sm font-semibold text-foreground"

  const formBody = (
    <form
      id={id}
      action={(formData) => {
        trackEvent("signup_submit", { context: contextSource ?? variant })
        return formAction(formData)
      }}
      className="space-y-5"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <label htmlFor={`email-${variant}-${id ?? ""}`} className={labelClass}>
            Email
          </label>
          <input
            id={`email-${variant}-${id ?? ""}`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            placeholder="name@domain.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`role-${variant}-${id ?? ""}`} className={labelClass}>
            What best describes you? (optional)
          </label>
          <select
            id={`role-${variant}-${id ?? ""}`}
            name="role"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            defaultValue=""
          >
            <option value="">Select one</option>
            <option value="Venue">Venue</option>
            <option value="DJ">DJ</option>
            <option value="Lighting Operator">Lighting Operator</option>
            <option value="Rental">Rental</option>
            <option value="Mobile Rig">Mobile Rig</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor={`dmx-${variant}-${id ?? ""}`} className={labelClass}>
            DMX Setup (optional)
          </label>
          <input
            id={`dmx-${variant}-${id ?? ""}`}
            name="dmx_setup"
            type="text"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            placeholder="Number of universes, fixtures, etc."
          />
        </div>

        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-sm font-semibold text-foreground underline underline-offset-4"
        >
          More details (optional)
        </button>
        {showDetails ? (
          <div className="space-y-3 rounded-lg border border-dashed border-border bg-accent/50 p-3">
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor={`name-${variant}-${id ?? ""}`}>
                Name (optional)
              </label>
              <input
                id={`name-${variant}-${id ?? ""}`}
                name="name"
                type="text"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
                placeholder="Name"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor={`notes-${variant}-${id ?? ""}`}>
                Other details (optional)
              </label>
              <textarea
                id={`notes-${variant}-${id ?? ""}`}
                name="notes"
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
                placeholder="Needs, timeline, special requirements"
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
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
        >
          {ctaLabel}
        </button>
        {state.message ? (
          <div
            className={clsx(
              "rounded-lg px-3 py-2 text-sm",
              state.status === "success"
                ? "bg-accent text-foreground"
                : "bg-destructive/10 text-destructive-foreground",
            )}
          >
            {state.status === "success"
              ? "Thanks! You're on the list. We'll be in touch when pilot opens."
              : state.message}
          </div>
        ) : null}
        {state.status === "success" ? (
          <Link
            href={secondaryCtaHref}
            className="text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
          >
            {secondaryCtaLabel}
          </Link>
        ) : (
          <p className="text-xs text-muted-foreground">Pilot invitation + updates. Unsubscribe anytime.</p>
        )}
      </div>
    </form>
  )

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-xl border border-border/40 bg-card p-6 shadow-2xl">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-label text-muted-foreground">Join the pilot queue</p>
              <h2 className="text-heading text-foreground">Get Early Access to Y-Link</h2>
              <p className="text-sm text-muted-foreground">
                Express interest, and we'll follow up with pilots and updates.
              </p>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {formBody}
        </div>
      </div>
    )
  }

  return (
    <div className={containerClasses} id={id}>
      <div className="space-y-2">
        <p className="text-label text-muted-foreground">{safeTitle}</p>
        <p className="text-sm text-muted-foreground">{safeDescription}</p>
      </div>
      <div className={variant === "footer" ? "mt-3" : "mt-5"}>{formBody}</div>
    </div>
  )
}
