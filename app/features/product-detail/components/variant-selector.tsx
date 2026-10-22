import { Link } from "react-router";

import {
  getCategory,
  type CategorySlug,
  type VariantSelection,
} from "~/features/catalogue";
import { cn } from "~/lib/utils";

const option =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border px-4 text-sm transition-colors duration-200";

function optionClasses(selected: boolean, available: boolean) {
  return cn(
    option,
    selected
      ? "border-onyx bg-onyx text-ivory"
      : "border-mocha/30 hover:border-onyx",
    !available &&
      !selected &&
      "text-muted-foreground line-through decoration-1",
  );
}

/**
 * Options are links to `?material=&size=`: the selection lives in the URL, so it can
 * be shared, survives refresh, works without JavaScript and needs no local state.
 * `replace` keeps Back from stepping through every option the shopper tried.
 */
export function VariantSelector({
  category,
  selection,
}: {
  category: CategorySlug;
  selection: VariantSelection;
}) {
  const { variant, materials, sizes } = selection;
  const selectedMaterial = materials.find((m) => m.selected);

  const hrefFor = (material: string, size: string | null) => {
    const params = new URLSearchParams({ material });
    if (size) params.set("size", size);
    return { search: `?${params.toString()}` };
  };

  return (
    <div className="space-y-7">
      <div role="group" aria-labelledby="metal-label">
        <p
          id="metal-label"
          className="mb-3 text-xs tracking-[0.18em] uppercase"
        >
          Metal:{" "}
          <span className="tracking-normal text-muted-foreground normal-case">
            {selectedMaterial?.name}
          </span>
        </p>
        <ul className="flex flex-wrap gap-2">
          {materials.map((material) => (
            <li key={material.slug}>
              <Link
                to={hrefFor(material.slug, variant.size)}
                replace
                preventScrollReset
                aria-current={material.selected ? "true" : undefined}
                className={optionClasses(material.selected, material.available)}
              >
                <span
                  aria-hidden="true"
                  className="size-4 rounded-full border border-mocha/30"
                  style={{ backgroundColor: material.swatch }}
                />
                {material.name}
                {!material.available ? (
                  <span className="sr-only"> (sold out)</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {sizes.length > 0 ? (
        <div role="group" aria-labelledby="size-label">
          <p
            id="size-label"
            className="mb-3 text-xs tracking-[0.18em] uppercase"
          >
            {getCategory(category).sizeLabel}:{" "}
            <span className="tracking-normal text-muted-foreground normal-case">
              {variant.size}
            </span>
          </p>
          <ul className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <li key={size.value}>
                <Link
                  to={hrefFor(variant.material, size.value)}
                  replace
                  preventScrollReset
                  aria-current={size.selected ? "true" : undefined}
                  className={optionClasses(size.selected, size.available)}
                >
                  {size.value}
                  {!size.available ? (
                    <span className="sr-only"> (sold out)</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
