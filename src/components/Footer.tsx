import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container-custom py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
              Y-Link
            </Link>
            <p className="text-sm text-muted-foreground prose-constrained">
              Professional DMX lighting control platform. Engineered for precision, stability, and live performance.
            </p>
            <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card px-4 py-3">
              <Image src="/ALPINE-Logo.png" alt="ALPINE Protocol" width={80} height={24} className="opacity-80" />
              <div className="h-8 w-px bg-border" />
              <p className="text-xs text-muted-foreground">Built on ALPINE protocol</p>
            </div>
            {/* End of addition */}
            <div className="text-sm text-muted-foreground">
              <p>Kristiansand, Norway</p>
              <a
                href="mailto:hello@y-link.no"
                className="text-foreground underline underline-offset-4 hover:opacity-80"
              >
                hello@y-link.no
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <p className="text-label text-muted-foreground">Product</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href="/ai-dmx-controller"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Platform
                </Link>
                <Link href="/use-cases" className="text-muted-foreground hover:text-foreground transition-colors">
                  Use Cases
                </Link>
                <Link href="/pilot" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pilot Program
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-label text-muted-foreground">Resources</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/guides" className="text-muted-foreground hover:text-foreground transition-colors">
                  Guides
                </Link>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-label text-muted-foreground">Company</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/om" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Y-Link. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
