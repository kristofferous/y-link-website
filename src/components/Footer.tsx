"use client";

import Link from "next/link";
import Image from "next/image";
import { prefixLocale } from "@/lib/i18n/routing";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

export function Footer() {
  const { dictionary, locale } = useTranslations();
  const { footer } = dictionary;

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container-custom py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Brand */}
          <div className="space-y-4">
            <Link href={prefixLocale(locale, "/")} className="inline-flex items-center">
              <Image
                src="/Y-Link-Logo.svg"
                alt="Y-Link"
                width={140}
                height={36}
                className="h-7 w-auto dark:invert"
              />
              <span className="sr-only">Y-Link</span>
            </Link>
            <p className="text-sm text-muted-foreground prose-constrained">{footer.tagline}</p>
            <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card px-4 py-3">
              <Image src="/ALPINE-Logo.png" alt="ALPINE Protocol" width={80} height={24} className="opacity-80" />
              <div className="h-8 w-px bg-border" />
              <p className="text-xs text-muted-foreground">{footer.builtOn}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{footer.location}</p>
              <a href="mailto:hello@y-link.no" className="text-foreground underline underline-offset-4 hover:opacity-80">
                hello@y-link.no
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <p className="text-label text-muted-foreground">{footer.product.title}</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href={prefixLocale(locale, "/ai-dmx-controller")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {footer.product.links.platform}
                </Link>
                <Link
                  href={prefixLocale(locale, "/use-cases")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {footer.product.links.useCases}
                </Link>
                <Link
                  href={prefixLocale(locale, "/pilot")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {footer.product.links.pilot}
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-label text-muted-foreground">{footer.resources.title}</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href={prefixLocale(locale, "/guides")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {footer.resources.links.guides}
                </Link>
                <Link
                  href={prefixLocale(locale, "/blog")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {footer.resources.links.blog}
                </Link>
                <Link
                  href={prefixLocale(locale, "/faq")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {footer.resources.links.faq}
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-label text-muted-foreground">{footer.company.title}</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href={prefixLocale(locale, "/om")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {footer.company.links.about}
                </Link>
                <Link
                  href={prefixLocale(locale, "/privacy")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {footer.company.links.privacy}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Y-Link. {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
