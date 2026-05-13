import { useState } from "react";

/**
 * @param {{ tickets: import('../../../api/briefTickets.types.js').PlainTicket[] }} props
 */
function formatTicketsMarkdown(tickets) {
  return tickets
    .map((t, i) => {
      const ac = (t.acceptanceCriteria ?? [])
        .map((line) => `- ${line}`)
        .join("\n");
      const deps = t.dependencies?.length
        ? `\n**Dependencies:** ${t.dependencies.join(", ")}`
        : "";
      const pri = t.priority ? `\n**Priority:** ${t.priority}` : "";
      const labels = t.labels?.length
        ? `\n**Labels:** ${t.labels.join(", ")}`
        : "";
      return `### ${i + 1}. ${t.title}\n\n${t.description}\n\n**Acceptance criteria:**\n${ac}${deps}${pri}${labels}\n`;
    })
    .join("\n---\n\n");
}

/**
 * @param {{
 *   tickets: import('../../../api/briefTickets.types.js').PlainTicket[],
 *   notes?: string,
 *   onReset: () => void,
 * }} props
 */
export function TicketList({ tickets, notes, onReset }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyMarkdown() {
    const md = formatTicketsMarkdown(tickets);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleDownloadJson() {
    const blob = new Blob([JSON.stringify({ tickets, notes }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "developer-tickets.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bt-tickets">
      {copied && (
        <p className="bt-toast" role="status">
          Markdown copied to clipboard
        </p>
      )}
      <div className="bt-tickets__header">
        <h2 className="bt-section-title">Developer tickets</h2>
        <div className="bt-actions bt-actions--inline">
          <button
            type="button"
            className="bt-btn bt-btn--secondary"
            onClick={handleCopyMarkdown}
          >
            Copy as Markdown
          </button>
          <button
            type="button"
            className="bt-btn bt-btn--secondary"
            onClick={handleDownloadJson}
          >
            Download JSON
          </button>
          <button type="button" className="bt-btn bt-btn--ghost" onClick={onReset}>
            Start over
          </button>
        </div>
      </div>
      {notes && (
        <div className="bt-notes" role="note">
          <strong>Notes:</strong> {notes}
        </div>
      )}
      <ul className="bt-ticket-cards">
        {tickets.map((t, idx) => (
          <li key={`${t.title}-${idx}`} className="bt-ticket-card">
            <div className="bt-ticket-card__top">
              <h3 className="bt-ticket-card__title">{t.title}</h3>
              <span className="bt-ticket-card__badge">#{idx + 1}</span>
            </div>
            <p className="bt-ticket-card__desc">{t.description}</p>
            {(t.priority || (t.labels && t.labels.length > 0)) && (
              <div className="bt-chip-row" aria-label="Tags">
                {t.priority ? (
                  <span className="bt-chip bt-chip--priority">{t.priority}</span>
                ) : null}
                {t.labels?.map((lab) => (
                  <span key={lab} className="bt-chip">
                    {lab}
                  </span>
                ))}
              </div>
            )}
            <div className="bt-ticket-card__section">
              <span className="bt-ticket-card__label">Acceptance criteria</span>
              <ul>
                {t.acceptanceCriteria.map((c, j) => (
                  <li key={j}>{c}</li>
                ))}
              </ul>
            </div>
            {t.dependencies?.length ? (
              <dl className="bt-ticket-meta">
                <dt>Dependencies</dt>
                <dd>{t.dependencies.join(", ")}</dd>
              </dl>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
