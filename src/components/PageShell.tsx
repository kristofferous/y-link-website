import { type ReactNode } from "react";
import clsx from "clsx";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  spacingClass?: string;
};

export function PageShell({ children, className, spacingClass }: PageShellProps) {
  return (
    <main className="relative">
      <div
        className={clsx(
          "relative mx-auto flex max-w-5xl flex-col px-6",
          spacingClass ?? "gap-16 py-16",
          className,
        )}
      >
        {children}
      </div>
    </main>
  );
}
