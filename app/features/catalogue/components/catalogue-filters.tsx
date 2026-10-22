import { SlidersHorizontal } from "lucide-react";
import { useId } from "react";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import {
  getActiveFilters,
  resetFilters,
  toggleListValue,
  withInStock,
  withPriceRange,
} from "../catalogue-query";
import { categories } from "../categories";
import type { FilterOptions } from "../catalogue.types";
import { materials } from "../materials";
import { useCatalogueQuery, useGoToQuery } from "../use-catalogue-query";

const checkbox =
  "border-mocha/60 checked:border-onyx checked:bg-onyx size-[1.125rem] shrink-0 cursor-pointer appearance-none border bg-center bg-no-repeat transition-colors duration-200 checked:bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23faf7f2' stroke-width='2'%3E%3Cpath d='M3.5 8.5l3 3 6-7'/%3E%3C/svg%3E\")]";

function Option({
  label,
  checked,
  onChange,
  swatch,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  swatch?: string;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        className={checkbox}
        checked={checked}
        onChange={onChange}
      />
      {swatch ? (
        <span
          aria-hidden="true"
          className="size-3.5 rounded-full border border-mocha/30"
          style={{ backgroundColor: swatch }}
        />
      ) : null}
      {label}
    </label>
  );
}

function Group({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-5 min-w-0 border-b border-border pb-5 last:mb-0 last:border-b-0 last:pb-0">
      <legend className="mb-2 p-0 text-xs tracking-[0.18em] uppercase">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

function PriceRange({
  priceRange,
}: {
  priceRange: FilterOptions["priceRange"];
}) {
  const query = useCatalogueQuery();
  const goTo = useGoToQuery();
  const id = useId();

  function commit(form: HTMLFormElement) {
    const data = new FormData(form);
    const toDollars = (value: FormDataEntryValue | null) =>
      typeof value === "string" && /^\d+$/.test(value.trim())
        ? Number(value)
        : undefined;
    const min = toDollars(data.get("min"));
    const max = toDollars(data.get("max"));
    if (min === query.minPrice && max === query.maxPrice) return;
    goTo((current) => withPriceRange(current, min, max));
  }

  const input =
    "border-mocha/40 focus-visible:border-onyx h-11 w-full border bg-transparent px-3 text-sm placeholder:text-mocha/50";

  return (
    <form
      // Remount when the URL changes (Back/Forward, chip removal) so inputs show the current values.
      key={`${query.minPrice ?? ""}-${query.maxPrice ?? ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        commit(event.currentTarget);
      }}
      onBlur={(event) => {
        // Only commit when focus leaves the whole form, not when tabbing min -> max.
        if (!event.currentTarget.contains(event.relatedTarget))
          commit(event.currentTarget);
      }}
      className="flex items-end gap-2"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor={`${id}-min`} className="sr-only">
          Minimum price in dollars
        </label>
        <input
          id={`${id}-min`}
          name="min"
          inputMode="numeric"
          autoComplete="off"
          placeholder={`$${priceRange.min.toLocaleString("en-US")}`}
          defaultValue={query.minPrice ?? ""}
          className={input}
        />
      </div>
      <span aria-hidden="true" className="pb-3 text-muted-foreground">
        –
      </span>
      <div className="min-w-0 flex-1">
        <label htmlFor={`${id}-max`} className="sr-only">
          Maximum price in dollars
        </label>
        <input
          id={`${id}-max`}
          name="max"
          inputMode="numeric"
          autoComplete="off"
          placeholder={`$${priceRange.max.toLocaleString("en-US")}`}
          defaultValue={query.maxPrice ?? ""}
          className={input}
        />
      </div>
      <Button type="submit" variant="outline" size="sm" className="px-4">
        Apply
      </Button>
    </form>
  );
}

/**
 * Every control reads the *intended* query and navigates to a new URL; there is no
 * local filter state, so the panel can render in two places (sidebar and sheet) and
 * stay consistent.
 */
export function FilterFields({ options }: { options: FilterOptions }) {
  const query = useCatalogueQuery();
  const goTo = useGoToQuery();

  return (
    <div>
      <Group legend="Category">
        {categories.map((c) => (
          <Option
            key={c.slug}
            label={c.name}
            checked={query.categories.includes(c.slug)}
            onChange={() =>
              goTo((current) => toggleListValue(current, "categories", c.slug))
            }
          />
        ))}
      </Group>
      <Group legend="Collection">
        {options.collections.map((c) => (
          <Option
            key={c.slug}
            label={c.name}
            checked={query.collections.includes(c.slug)}
            onChange={() =>
              goTo((current) => toggleListValue(current, "collections", c.slug))
            }
          />
        ))}
      </Group>
      <Group legend="Material">
        {materials.map((m) => (
          <Option
            key={m.slug}
            label={m.name}
            swatch={m.swatch}
            checked={query.materials.includes(m.slug)}
            onChange={() =>
              goTo((current) => toggleListValue(current, "materials", m.slug))
            }
          />
        ))}
      </Group>
      <Group legend="Availability">
        <Option
          label="In stock only"
          checked={query.inStock}
          onChange={() =>
            goTo((current) => withInStock(current, !current.inStock))
          }
        />
      </Group>
      <Group legend="Price (USD)">
        <PriceRange priceRange={options.priceRange} />
      </Group>
    </div>
  );
}

/** Mobile entry point: the same fields in a drawer, with a clear way back to the results. */
export function FilterSheet({ options }: { options: FilterOptions }) {
  const query = useCatalogueQuery();
  const goTo = useGoToQuery();
  const activeCount = getActiveFilters(query).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal aria-hidden="true" />
          Filters
          {activeCount > 0 ? (
            <>
              <span aria-hidden="true">({activeCount})</span>
              <span className="sr-only">, {activeCount} active</span>
            </>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-0 overflow-hidden p-0">
        <div className="shrink-0 px-6 pt-6 pb-4">
          <SheetTitle className="text-3xl">Filters</SheetTitle>
          <SheetDescription className="sr-only">
            Narrow the catalogue by category, collection, material, availability
            and price.
          </SheetDescription>
        </div>
        {/* Only this region scrolls; the footer below is an ordinary flex child. */}
        {/* `relative` makes this the containing block for the sr-only (absolute) labels
            inside, so they are clipped here instead of stretching the whole sheet. */}
        <div className="relative min-h-0 flex-1 overflow-y-auto px-6">
          <FilterFields options={options} />
        </div>
        <div className="flex shrink-0 gap-3 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            variant="ghost"
            size="sm"
            disabled={activeCount === 0}
            onClick={() => goTo(resetFilters)}
          >
            Reset
          </Button>
          <SheetClose asChild>
            <Button size="sm" className="flex-1">
              View results
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
