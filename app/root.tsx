import cormorant500 from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2?url";
import inter from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

// Fonts are self-hosted (see app.css): no third-party origin and no render-blocking
// stylesheet. Only the two files the first screen needs are preloaded.
const preloadFont = (href: string) => ({
  rel: "preload",
  href,
  as: "font",
  type: "font/woff2",
  crossOrigin: "anonymous" as const,
});

export const links: Route.LinksFunction = () => [
  preloadFont(cormorant500),
  preloadFont(inter),
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#faf7f2" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

/** Last-resort boundary; storefront routes handle their own errors with the shell intact. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Something went wrong";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Page not found" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-24 text-center">
      <title>{`${message} | Aurelle`}</title>
      <h1 className="text-5xl">{message}</h1>
      <p className="mt-4 text-muted-foreground">{details}</p>
      <a
        href="/"
        className="mt-8 inline-block text-xs tracking-[0.18em] uppercase underline underline-offset-8"
      >
        Return home
      </a>
      {stack ? (
        <pre className="mt-8 w-full overflow-x-auto p-4 text-left text-xs">
          <code>{stack}</code>
        </pre>
      ) : null}
    </main>
  );
}
