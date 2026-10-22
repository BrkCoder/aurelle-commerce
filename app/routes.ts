import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/storefront-layout.tsx", [
    layout("routes/storefront-boundary.tsx", [
      index("routes/home.tsx"),
      route("catalogue", "routes/catalogue.tsx"),
      route("products/:slug", "routes/product.tsx"),
      // Catch-all: throws a real 404 that the boundary above renders.
      route("*", "routes/not-found.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
