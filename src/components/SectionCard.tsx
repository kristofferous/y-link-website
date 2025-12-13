import type { ReactNode } from "react"
import clsx from "clsx"

type SectionCardProps = {
  children: ReactNode
  className?: string
}

export function SectionCard({ children, className }: SectionCardProps) {
  return <div className={clsx("rounded-xl border border-border/40 bg-card p-8 shadow-lg", className)}>{children}</div>
}
// </CHANGE>
