"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { prefixLocale } from "@/lib/i18n/routing";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { locale, dictionary } = useTranslations();
  const { navigation } = dictionary;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  const isActive = (href: string) => {
    const localizedHref = prefixLocale(locale, href);
    if (href === "/") {
      return pathname === localizedHref;
    }
    return pathname?.startsWith(localizedHref);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={prefixLocale(locale, "/")}
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <Image
              src="/Y-Link-Logo.svg"
              alt="Y-Link"
              width={120}
              height={32}
              className="h-6 w-auto"
              priority
            />
            <span className="sr-only">Y-Link</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navigation.main.map((link) => (
              <Link
                key={link.href}
                href={prefixLocale(locale, link.href)}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              href={prefixLocale(locale, "/pilot")}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {navigation.cta}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? navigation.mobile.close : navigation.mobile.open}
              aria-expanded={open}
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-accent"
            >
              <span className="sr-only">{open ? navigation.mobile.close : navigation.mobile.open}</span>
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
                  {navigation.mobile.navigation}
                </p>
                {navigation.main.map((link) => (
                  <Link
                    key={link.href}
                    href={prefixLocale(locale, link.href)}
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
                  {navigation.mobile.company}
                </p>
                {navigation.secondary.map((link) => (
                  <Link
                    key={link.href}
                    href={prefixLocale(locale, link.href)}
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
                  {navigation.mobile.utility}
                </p>
                {navigation.utility.map((link) => (
                  <Link
                    key={link.href}
                    href={prefixLocale(locale, link.href)}
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

              <div className="mt-6 border-t border-border/40 pt-6">
                <LanguageSwitcher className="px-4" />
              </div>
            </div>
          </nav>

          {/* Mobile CTA - fixed at bottom */}
          <div className="border-t border-border bg-background">
            <div className="container-custom py-6">
              <Link
                href={prefixLocale(locale, "/pilot")}
                onClick={close}
                className="flex w-full items-center justify-center rounded-lg bg-primary py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {navigation.cta}
              </Link>
              <p className="mt-4 text-center text-sm text-muted-foreground">{navigation.mobile.ctaNote}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
