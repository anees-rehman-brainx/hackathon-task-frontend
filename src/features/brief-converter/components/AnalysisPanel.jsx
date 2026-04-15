import styles from "./AnalysisPanel.module.css";

function List({ title, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i}>{typeof item === "string" ? item : String(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export function AnalysisPanel({ analysis }) {
  if (!analysis) return null;

  const understanding =
    typeof analysis.briefUnderstanding === "string"
      ? analysis.briefUnderstanding
      : null;

  return (
    <section className={styles.section} aria-labelledby="analysis-heading">
      <h2 id="analysis-heading" className={styles.title}>
        Technical read
      </h2>
      {understanding ? (
        <p className={styles.lead}>{understanding}</p>
      ) : (
        <p className={styles.muted}>No summary returned.</p>
      )}

      <List title="Contradictions" items={analysis.contradictions} />
      <List
        title="Assumptions we will not make without input"
        items={analysis.assumptionsWeRefuseToMake}
      />

      {typeof analysis.provisionalScopeNotes === "string" &&
      analysis.provisionalScopeNotes.trim() ? (
        <div className={styles.note}>
          <span className={styles.noteLabel}>Working notes</span>{" "}
          {analysis.provisionalScopeNotes}
        </div>
      ) : null}
    </section>
  );
}
