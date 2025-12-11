import { type ReactNode } from "react";
import clsx from "clsx";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className="relative">
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
