/**
 * @param {{ label?: string }} props
 */
export function LoadingPanel({ label = "Working…" }) {
  return (
    <aside className="bt-loading-card" aria-live="polite">
      <span className="bt-loading__spinner" aria-hidden />
      <span className="bt-loading__text">{label}</span>
    </aside>
  );
}
