"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Hjem" },
  { href: "/ai-dmx-controller", label: "Hvordan det fungerer" },
  { href: "/use-cases", label: "Bruksområder" },
  { href: "/guides", label: "Guider" },
  { href: "/om", label: "Om" },
  { href: "/pilot", label: "Pilot" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/30 bg-neutral-50/80 text-neutral-900 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="label-text text-sm font-semibold text-neutral-900"
        >
          Y-Link
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-2 text-sm text-neutral-900">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-full px-3 py-2 font-medium transition",
                  isActive
                    ? "bg-neutral-900 text-white shadow-[0_10px_30px_-24px_rgba(0,0,0,0.45)]"
                    : "text-neutral-900 hover:bg-neutral-200/70",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
