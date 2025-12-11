import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Brødsmulesti"
      className={className}
    >
      <ol className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-neutral-800"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-700">{item.label}</span>
              )}
              {!isLast ? <span className="text-neutral-300">›</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
