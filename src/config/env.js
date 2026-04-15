/**
 * Central place for client-side env. Vite exposes only `VITE_*` variables.
 *
 * Dev: when `VITE_API_BASE_URL` is unset, use same-origin (empty base) so
 * requests go to the Vite dev server and `vite.config.js` proxies `/api` → backend.
 * Prod: set `VITE_API_BASE_URL` to your deployed API origin (no trailing slash).
 */
export function getApiBaseUrl() {
  const explicit = String(import.meta.env.VITE_API_BASE_URL ?? "")
    .trim()
    .replace(/\/$/, "");
  if (explicit) return explicit;
  if (import.meta.env.DEV) return "";
  return "http://127.0.0.1:5000";
}
