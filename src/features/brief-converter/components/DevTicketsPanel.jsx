import styles from "./DevTicketsPanel.module.css";

function SubList({ title, items, variant = "default" }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const listClass =
    variant === "mono" ? styles.subListMono : styles.subList;
  return (
    <div className={styles.sub}>
      <h4 className={styles.subTitle}>{title}</h4>
      <ul className={listClass}>
        {items.map((item, i) => (
          <li key={i}>
            {typeof item === "string" ? item : String(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OptionalBlock({ label, value }) {
  if (typeof value !== "string" || !value.trim()) return null;
  return (
    <p className={styles.optional}>
      <span className={styles.optLabel}>{label}:</span> {value}
    </p>
  );
}

export function DevTicketsPanel({ payload }) {
  if (!payload) return null;

  const rawTasks = Array.isArray(payload.tasks) ? payload.tasks : [];
  const tasks = [...rawTasks].sort((a, b) => {
    const ao = Number(a?.suggestedOrder);
    const bo = Number(b?.suggestedOrder);
    const aOk = Number.isFinite(ao);
    const bOk = Number.isFinite(bo);
    if (aOk && bOk) return ao - bo;
    if (aOk) return -1;
    if (bOk) return 1;
    return 0;
  });

  const epic =
    typeof payload.epicSummary === "string" ? payload.epicSummary : null;
  const notes =
    typeof payload.implementationNotes === "string"
      ? payload.implementationNotes
      : null;

  return (
    <section className={styles.section} aria-labelledby="tickets-heading">
      <h2 id="tickets-heading" className={styles.title}>
        Implementation tickets
      </h2>
      {epic ? <p className={styles.epic}>{epic}</p> : null}

      <div className={styles.grid}>
        {tasks.map((t, index) => (
          <article
            key={
              typeof t.id === "string" && t.id
                ? t.id
                : `task-${index}-${t.suggestedOrder ?? ""}`
            }
            className={styles.card}
          >
            <header className={styles.cardHead}>
              <div className={styles.meta}>
                {t.ticketType ? (
                  <span className={styles.type}>{t.ticketType}</span>
                ) : null}
                {t.priority ? (
                  <span className={styles.priority}>{t.priority}</span>
                ) : null}
                {Number.isFinite(Number(t.suggestedOrder)) ? (
                  <span className={styles.order}>#{t.suggestedOrder}</span>
                ) : null}
              </div>
              <h3 className={styles.cardTitle}>
                {typeof t.title === "string" ? t.title : "Untitled ticket"}
              </h3>
            </header>
            {typeof t.description === "string" && t.description.trim() ? (
              <p className={styles.desc}>{t.description}</p>
            ) : null}
            <SubList
              title="Implementation checklist"
              items={t.implementationChecklist}
              variant="mono"
            />
            <SubList title="Acceptance criteria" items={t.acceptanceCriteria} />
            <SubList title="Definition of done" items={t.definitionOfDone} />
            <OptionalBlock label="Technical notes" value={t.technicalNotes} />
            {Array.isArray(t.dependencies) && t.dependencies.length ? (
              <p className={styles.deps}>
                <span className={styles.optLabel}>Dependencies</span>{" "}
                {t.dependencies.join(" · ")}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      {notes ? (
        <div className={styles.footer}>
          <h3 className={styles.subheading}>Repo / rollout notes</h3>
          <p className={styles.footerText}>{notes}</p>
        </div>
      ) : null}

      {Array.isArray(payload.risksOrFollowUps) &&
      payload.risksOrFollowUps.length ? (
        <div className={styles.footer}>
          <h3 className={styles.subheading}>Risks / follow-ups</h3>
          <ul className={styles.footerList}>
            {payload.risksOrFollowUps.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {Array.isArray(payload.unresolvedGaps) &&
      payload.unresolvedGaps.length ? (
        <div className={styles.gaps} role="status">
          <h3 className={styles.subheading}>Unresolved gaps</h3>
          <ul>
            {payload.unresolvedGaps.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
