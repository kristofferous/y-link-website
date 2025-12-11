import { type ReactNode } from "react";
import clsx from "clsx";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl bg-white/85 p-8 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.35)] ring-1 ring-neutral-200 backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
