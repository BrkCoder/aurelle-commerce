export function loader() {
  throw new Response("Not Found", { status: 404 });
}

// A route module needs a default export; the loader above always throws first.
export default function NotFound() {
  return null;
}
