import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { buildBreadcrumbSchema } from "@/lib/seo";

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const schema = buildBreadcrumbSchema(items);

  return (
    <nav aria-label="Breadcrumbs" className={className}>
      <StructuredData data={schema} />
      <ol className="flex items-center gap-2 text-xs font-semibold label-text text-neutral-800">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-900">{item.label}</span>
              )}
              {!isLast ? <span className="text-neutral-500">{">"}</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
