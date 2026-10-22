import { Outlet } from "react-router";

import { PageProgress } from "./page-progress";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function StorefrontLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 bg-onyx px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <PageProgress />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
