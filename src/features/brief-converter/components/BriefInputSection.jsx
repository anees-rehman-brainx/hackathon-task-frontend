import { Spinner } from "../../../shared/ui/Spinner.jsx";
import styles from "./BriefInputSection.module.css";

export function BriefInputSection({
  value,
  onChange,
  onAnalyze,
  disabled,
  loading,
}) {
  return (
    <section className={styles.section} aria-labelledby="brief-heading">
      <h2 id="brief-heading" className={styles.title}>
        Client brief
      </h2>
      <p className={styles.hint}>
        Paste the raw brief. We will ask only technical blockers before
        generating implementation tickets.
      </p>
      <textarea
        className={styles.textarea}
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Need CSV export of orders for accounting, must run under 10k rows…"
        disabled={disabled}
        spellCheck
      />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={onAnalyze}
          disabled={disabled || loading || !value.trim()}
        >
          {loading ? (
            <>
              <Spinner size="sm" label="Analyzing brief" />
              <span>Analyzing…</span>
            </>
          ) : (
            "Analyze brief"
          )}
        </button>
      </div>
    </section>
  );
}
