"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import clsx from "clsx"
import { ThemeToggle } from "./ThemeToggle"

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/ai-dmx-controller", label: "Platform" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/guides", label: "Guides" },
  { href: "/faq", label: "FAQ" },
]

const secondaryLinks = [
  { href: "/pilot", label: "Pilot Program" },
  { href: "/teknisk", label: "Technical" },
  { href: "/om", label: "About Y-Link" },
  { href: "/story", label: "Our Story" },
]

const utilityLinks = [
  { href: "/access", label: "Pilot Access" },
  { href: "/privacy", label: "Privacy" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href))

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            Y-Link
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              href="/pilot"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Join Pilot
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-accent"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <div className="relative h-4 w-5">
                <span
                  className={clsx(
                    "absolute left-0 block h-0.5 w-full bg-foreground transition-all duration-200",
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 bg-foreground transition-all duration-200",
                    open ? "opacity-0" : "opacity-100",
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-0 block h-0.5 w-full bg-foreground transition-all duration-200",
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={clsx(
          "fixed inset-0 top-16 z-40 bg-background transition-opacity duration-200 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-full flex-col">
          <nav className="flex-1 overflow-y-auto">
            <div className="container-custom py-6">
              {/* Main Navigation */}
              <div className="space-y-1">
                <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigation
                </p>
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={clsx(
                      "flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <span>{link.label}</span>
                    <svg className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Secondary Navigation */}
              <div className="mt-6 space-y-1 border-t border-border/40 pt-6">
                <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Company
                </p>
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={clsx(
                      "flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <span>{link.label}</span>
                    <svg className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Utility Links */}
              <div className="mt-6 space-y-1 border-t border-border/40 pt-6">
                <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Account & Legal
                </p>
                {utilityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={clsx(
                      "flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <span>{link.label}</span>
                    <svg className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Mobile CTA - fixed at bottom */}
          <div className="border-t border-border bg-background">
            <div className="container-custom py-6">
              <Link
                href="/pilot"
                onClick={close}
                className="flex w-full items-center justify-center rounded-lg bg-primary py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Join Pilot Program
              </Link>
              <p className="mt-4 text-center text-sm text-muted-foreground">Limited slots available for early access</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
