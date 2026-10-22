import { useSyncExternalStore } from "react";
import { useLocation, useNavigate, useNavigation } from "react-router";

import {
  parseCatalogueSearchParams,
  toSearchString,
  type CatalogueQuery,
} from "./catalogue-query";

/**
 * The query URL of the navigation the user just asked for, until it settles.
 *
 * React Router only exposes a pending navigation after React re-renders, so without
 * this two quick clicks would both build on the same stale query and the second would
 * silently discard the first, and a controlled checkbox would flicker back to its old
 * state for a frame. Handlers apply their change to this value, and every control
 * reads it, so the UI is consistent the instant a click happens.
 *
 * A tiny external store rather than context or state: the sidebar, sheet and sort
 * control are separate components that must see each other's requests. It is only
 * written from event handlers, so it is always `null` during server rendering.
 */
let requestedSearch: string | null = null;
const listeners = new Set<() => void>();

function setRequestedSearch(search: string | null) {
  requestedSearch = search;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getRequested = () => requestedSearch;
const getRequestedOnServer = () => null;

/** Requested URL, else the pending navigation's, else the current one. */
function useIntendedSearch(): string {
  const location = useLocation();
  const { location: pending } = useNavigation();
  const requested = useSyncExternalStore(
    subscribe,
    getRequested,
    getRequestedOnServer,
  );
  if (requested !== null) return requested;
  return pending?.pathname === location.pathname
    ? pending.search
    : location.search;
}

/** The query the user *intends*, for rendering checkboxes, chips and the sort control. */
export function useCatalogueQuery(): CatalogueQuery {
  return parseCatalogueSearchParams(new URLSearchParams(useIntendedSearch()));
}

/**
 * Returns `goTo(update)`: applies `update` to the latest intended query and pushes a
 * history entry (so Back/Forward step through filter states), keeping scroll position.
 */
export function useGoToQuery() {
  const navigate = useNavigate();
  const intendedSearch = useIntendedSearch();

  return (update: (current: CatalogueQuery) => CatalogueQuery) => {
    // Read the store directly: a handler may run before this render's snapshot updates.
    const base = requestedSearch ?? intendedSearch;
    const next = toSearchString(
      update(parseCatalogueSearchParams(new URLSearchParams(base))),
    );
    setRequestedSearch(next);
    void Promise.resolve(
      navigate({ search: next }, { preventScrollReset: true }),
    ).finally(() => {
      // A newer request may have replaced ours; only clear if we are still the latest.
      if (requestedSearch === next) setRequestedSearch(null);
    });
  };
}
