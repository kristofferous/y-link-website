import Link from "next/link"
import { StructuredData } from "@/components/StructuredData"
import { buildBreadcrumbSchema } from "@/lib/seo"

type Crumb = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: Crumb[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const schema = buildBreadcrumbSchema(items)

  return (
    <nav aria-label="Breadcrumbs" className={className}>
      <StructuredData data={schema} />
      <ol className="flex items-center gap-2 text-xs font-semibold text-label text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
              {!isLast ? <span className="text-muted-foreground/60">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
