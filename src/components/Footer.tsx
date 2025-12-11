import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-neutral-200/70 bg-neutral-50 text-neutral-800 shadow-[0_-8px_30px_-24px_rgba(0,0,0,0.15)]">
      <div className="absolute inset-x-0 -top-[1px] h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-neutral-900">Y-Link</p>
          <p className="text-neutral-800">
            Presis lyskontroll, bygget for stabile produksjoner.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="transition hover:text-neutral-900">
            Hjem
          </Link>
          <Link
            href="/privacy"
            className="transition hover:text-neutral-900"
          >
            Personvern
          </Link>
        </div>
      </div>
    </footer>
  );
}
