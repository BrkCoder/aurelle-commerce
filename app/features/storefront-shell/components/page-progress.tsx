import { useNavigation } from "react-router";

/** Route-transition loading state: a thin bar plus a polite screen-reader cue. */
export function PageProgress() {
  const navigation = useNavigation();
  const loading = navigation.state !== "idle";

  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{loading ? "Loading page" : ""}</span>
      {loading ? (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left animate-pulse bg-champagne"
        />
      ) : null}
    </div>
  );
}
