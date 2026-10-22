import {
  renderPlaceholderSvg,
  placeholderParamsSchema,
} from "~/features/catalogue/placeholder-art";

import type { Route } from "./+types/placeholder-image";

/** TEMPORARY resource route serving generated placeholder product images. */
export function loader({ params, request }: Route.LoaderArgs) {
  const parsed = placeholderParamsSchema.safeParse({
    category: params.category,
    material: params.material,
    view: params.view?.replace(/\.svg$/, ""),
    seed: new URL(request.url).searchParams.get("seed") ?? undefined,
  });
  if (!parsed.success) throw new Response("Not Found", { status: 404 });

  return new Response(renderPlaceholderSvg(parsed.data), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Pure function of the URL, so it can be cached forever.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
