import { isRouteErrorResponse, Outlet } from "react-router";

import { Container } from "~/components/container";
import { StatusMessage } from "~/components/status-message";
import { Button } from "~/components/ui/button";

import type { Route } from "./+types/storefront-boundary";

/**
 * Pathless wrapper whose only job is catching errors from storefront pages.
 * A boundary replaces the route it is on, so it must sit *below* the layout
 * route: the error then renders inside the layout's <Outlet />, keeping the
 * header and footer on screen.
 */
export default function StorefrontBoundary() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <Container>
      <StatusMessage
        eyebrow={notFound ? "Error 404" : "Something went wrong"}
        title={notFound ? "This page has slipped away" : "We hit a snag"}
        action={
          <Button asChild>
            <a href="/">Return home</a>
          </Button>
        }
      >
        {notFound
          ? "The page you are looking for doesn't exist or has moved."
          : "An unexpected error occurred. Please try again in a moment."}
      </StatusMessage>
    </Container>
  );
}
