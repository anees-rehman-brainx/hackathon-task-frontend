/**
 * @param {{
 *   questions: { id: string, question: string }[],
 *   answers: Record<string, string>,
 *   onAnswerChange: (questionId: string, value: string) => void,
 *   onSubmit: () => void,
 *   onBack: () => void,
 *   disabled?: boolean,
 * }} props
 */
export function ClarificationForm({
  questions,
  answers,
  onAnswerChange,
  onSubmit,
  onBack,
  disabled = false,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (disabled) return;
    const missing = questions.filter((q) => !String(answers[q.id] ?? "").trim());
    if (missing.length) return;
    onSubmit();
  }

  return (
    <form className="bt-form" onSubmit={handleSubmit}>
      <h2 className="bt-section-title">Clarifications needed</h2>
      <p className="bt-lede">
        Answer each question so we can produce accurate developer tickets. Use
        &quot;Unknown&quot; only if you truly cannot answer.
      </p>
      <ol className="bt-question-list">
        {questions.map((q) => (
          <li key={q.id} className="bt-question-item">
            <label className="bt-label" htmlFor={`q-${q.id}`}>
              {q.question}
            </label>
            <textarea
              id={`q-${q.id}`}
              className="bt-textarea bt-textarea--compact"
              rows={3}
              value={answers[q.id] ?? ""}
              onChange={(e) => onAnswerChange(q.id, e.target.value)}
              disabled={disabled}
            />
          </li>
        ))}
      </ol>
      <div className="bt-actions bt-actions--split">
        <button
          type="button"
          className="bt-btn bt-btn--ghost"
          onClick={onBack}
          disabled={disabled}
        >
          Edit requirements
        </button>
        <button
          type="submit"
          className="bt-btn bt-btn--primary"
          disabled={
            disabled ||
            questions.some((q) => !String(answers[q.id] ?? "").trim())
          }
        >
          Submit answers
        </button>
      </div>
    </form>
  );
}
