import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

/** Shared empty / error / not-found presentation. */
export function StatusMessage({
  eyebrow,
  title,
  children,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-lg py-16 text-center", className)}>
      {eyebrow ? (
        <p className="mb-4 text-xs tracking-[0.18em] text-champagne-deep uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-4xl md:text-5xl">{title}</h2>
      {children ? (
        <p className="mt-4 leading-relaxed text-muted-foreground">{children}</p>
      ) : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
