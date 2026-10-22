import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

export type Crumb = { label: string; to?: string };

/** The last crumb is the current page: plain text with `aria-current`, not a link. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-[0.12em] text-muted-foreground uppercase">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="inline-flex min-h-6 items-center transition-colors duration-200 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-foreground" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight aria-hidden="true" className="size-3" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
