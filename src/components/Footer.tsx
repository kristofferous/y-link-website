import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-neutral-200/70 bg-neutral-50 text-neutral-800 shadow-[0_-8px_30px_-24px_rgba(0,0,0,0.15)]">
      <div className="absolute inset-x-0 -top-[1px] h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 text-sm">
        <div className="space-y-2">
          <p className="font-semibold text-neutral-900">Y-Link</p>
          <p className="text-neutral-800">AI-drevet DMX-kontroller for musikkdrevne venues.</p>
          <p className="text-neutral-800">
            Kristiansand, Norge —{" "}
            <a href="mailto:hello@y-link.no" className="underline underline-offset-4">
              kontakt@y-link.no
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/ai-dmx-controller" className="transition hover:text-neutral-900">
            Hvordan det fungerer
          </Link>
          <Link href="/use-cases" className="transition hover:text-neutral-900">
            Bruksscenarier
          </Link>
          <Link href="/guides" className="transition hover:text-neutral-900">
            Guider
          </Link>
          <Link href="/faq" className="transition hover:text-neutral-900">
            FAQ
          </Link>
          <Link href="/privacy" className="transition hover:text-neutral-900">
            Personvern
          </Link>
        </div>
      </div>
    </footer>
  );
}
