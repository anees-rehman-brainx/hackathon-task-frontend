import { Spinner } from "../../../shared/ui/Spinner.jsx";
import styles from "./NoQuestionsActions.module.css";

export function NoQuestionsActions({ onFinalize, disabled, loading }) {
  return (
    <section className={styles.section} aria-labelledby="noq-heading">
      <h2 id="noq-heading" className={styles.title}>
        Clarifications
      </h2>
      <p className={styles.text}>
        No blocking questions were returned. You can still generate technical
        tickets; review <code className={styles.code}>unresolvedGaps</code>{" "}
        in the output if anything is underspecified.
      </p>
      <button
        type="button"
        className={styles.primary}
        onClick={onFinalize}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <Spinner size="sm" label="Generating tickets" />
            <span>Generating tickets…</span>
          </>
        ) : (
          "Generate dev tickets"
        )}
      </button>
    </section>
  );
}
