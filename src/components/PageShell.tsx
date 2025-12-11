import { type ReactNode } from "react";
import clsx from "clsx";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-50 text-neutral-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,#e9edf7_0,#e9edf7_30%,transparent_45%),radial-gradient(circle_at_80%_0%,#eef0ff_0,#eef0ff_25%,transparent_45%),radial-gradient(circle_at_50%_90%,#f1f5fb_0,#f1f5fb_25%,transparent_45%)]" />
      <div
        className={clsx(
          "relative mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16",
          className,
        )}
      >
        {children}
      </div>
    </main>
  );
}
