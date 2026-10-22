import { z } from "zod";

import type { ProductVariant } from "./catalogue.types";
import { materials, type MaterialSlug } from "./materials";

export type VariantSelectionInput = { material?: string; size?: string };

const optionParam = z.string().min(1).max(20).optional().catch(undefined);

/** Untrusted `?material=&size=` values; anything invalid is ignored, never an error. */
export function parseVariantSelection(
  params: URLSearchParams,
): VariantSelectionInput {
  return {
    material: optionParam.parse(params.get("material") ?? undefined),
    size: optionParam.parse(params.get("size") ?? undefined),
  };
}

export type MaterialOption = {
  slug: MaterialSlug;
  name: string;
  swatch: string;
  selected: boolean;
  /** At least one variant of this metal is in stock. */
  available: boolean;
};

export type SizeOption = {
  value: string;
  selected: boolean;
  available: boolean;
};

export type VariantSelection = {
  variant: ProductVariant;
  materials: MaterialOption[];
  /** Sizes offered in the selected metal. Empty for one-size pieces. */
  sizes: SizeOption[];
};

const naturalCompare = new Intl.Collator("en", { numeric: true }).compare;

function bySize(a: ProductVariant, b: ProductVariant): number {
  return naturalCompare(a.size ?? "", b.size ?? "");
}

const inStock = (v: ProductVariant) => v.stockQuantity > 0;

/**
 * Picks the variant to show and describes the options around it.
 *
 * Rules: honour a requested metal if the product has it, otherwise start from the
 * first metal that has stock. Within that metal honour the requested size if it
 * exists, otherwise take the first in-stock size (or the first size if none are).
 */
export function resolveVariantSelection(
  variants: ProductVariant[],
  requested: VariantSelectionInput = {},
): VariantSelection {
  if (variants.length === 0)
    throw new Error("A product needs at least one variant.");

  const present = materials.filter((m) =>
    variants.some((v) => v.material === m.slug),
  );
  const requestedMaterial = present.find(
    (m) => m.slug === requested.material,
  )?.slug;
  const defaultMaterial = (
    present.find((m) =>
      variants.some((v) => v.material === m.slug && inStock(v)),
    ) ?? present[0]
  )?.slug;
  const material = requestedMaterial ?? defaultMaterial;

  const inMaterial = variants
    .filter((v) => v.material === material)
    .sort(bySize);
  const variant =
    inMaterial.find(
      (v) => v.size === requested.size && requested.size !== undefined,
    ) ??
    inMaterial.find(inStock) ??
    inMaterial[0];
  if (!variant)
    throw new Error("Unreachable: selected material has no variants.");

  return {
    variant,
    materials: present.map((m) => ({
      slug: m.slug,
      name: m.name,
      swatch: m.swatch,
      selected: m.slug === variant.material,
      available: variants.some((v) => v.material === m.slug && inStock(v)),
    })),
    sizes: inMaterial.flatMap((v) =>
      v.size === null
        ? []
        : [
            {
              value: v.size,
              selected: v.id === variant.id,
              available: inStock(v),
            },
          ],
    ),
  };
}
