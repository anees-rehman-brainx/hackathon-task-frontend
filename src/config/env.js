/**
 * Central place for client-side env. Vite exposes only `VITE_*` variables.
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL ?? "";
  const trimmed = String(raw).trim().replace(/\/$/, "");
  return trimmed || "http://localhost:5000";
}
