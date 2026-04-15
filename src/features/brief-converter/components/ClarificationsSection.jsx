import { Spinner } from "../../../shared/ui/Spinner.jsx";
import styles from "./ClarificationsSection.module.css";

export function ClarificationsSection({
  questions,
  answersByQuestionId,
  onAnswerChange,
  onFinalize,
  disabled,
  loading,
  allAnswered,
}) {
  if (!questions.length) return null;

  return (
    <section className={styles.section} aria-labelledby="clarify-heading">
      <h2 id="clarify-heading" className={styles.title}>
        Engineering clarifications
      </h2>
      <p className={styles.hint}>
        Short answers are enough—these unblock implementation, not product
        research.
      </p>
      <ol className={styles.list}>
        {questions.map((q) => (
          <li key={q.id} className={styles.item}>
            <div className={styles.qhead}>
              <span className={styles.badge}>{q.id}</span>
              <p className={styles.question}>{q.question}</p>
            </div>
            {q.blockingReason ? (
              <p className={styles.blocker}>
                <span className={styles.blockerLabel}>Blocker</span>{" "}
                {q.blockingReason}
              </p>
            ) : null}
            <textarea
              className={styles.answer}
              rows={3}
              value={answersByQuestionId[q.id] ?? ""}
              onChange={(e) => onAnswerChange(q.id, e.target.value)}
              disabled={disabled}
              placeholder="Answer in 1–3 sentences…"
            />
          </li>
        ))}
      </ol>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={onFinalize}
          disabled={disabled || loading || !allAnswered}
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
        {!allAnswered ? (
          <span className={styles.warn}>Answer all questions to continue.</span>
        ) : null}
      </div>
    </section>
  );
}
