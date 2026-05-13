import { useCallback, useMemo, useState } from "react";
import {
  postAnalyzeBrief,
  postFinalizeBrief,
} from "../../api/briefTickets.js";
import { getRequestErrorMessage } from "./getRequestErrorMessage.js";
import { ClarificationForm } from "./components/ClarificationForm.jsx";
import { ErrorBanner } from "./components/ErrorBanner.jsx";
import { LoadingPanel } from "./components/LoadingPanel.jsx";
import { RequirementsForm } from "./components/RequirementsForm.jsx";
import { TicketList } from "./components/TicketList.jsx";
import "./brief-to-tickets.css";

/** @typedef {'requirements' | 'clarifications' | 'tickets'} Step */

export function BriefToTicketsFlow() {
  /** @type {[Step, import('react').Dispatch<import('react').SetStateAction<Step>>]} */
  const [step, setStep] = useState(
    /** @type {Step} */ ("requirements"),
  );
  const [requirements, setRequirements] = useState("");
  const [questions, setQuestions] = useState(
    /** @type {{ id: string, question: string }[]} */ ([]),
  );
  const [answers, setAnswers] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [tickets, setTickets] = useState(
    /** @type {import('../../api/briefTickets.types.js').PlainTicket[]} */ ([]),
  );
  const [notes, setNotes] = useState(/** @type {string | undefined} */ (undefined));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  const clarificationsSkipped = useMemo(
    () => step === "tickets" && questions.length === 0,
    [questions.length, step],
  );

  const stepper = useMemo(() => {
    const s1 =
      step === "requirements"
        ? "bt-step is-active"
        : "bt-step is-complete";
    let s2 = "bt-step is-upcoming";
    if (step === "clarifications") s2 = "bt-step is-active";
    else if (step === "tickets") {
      s2 = clarificationsSkipped
        ? "bt-step is-skipped"
        : "bt-step is-complete";
    }
    const s3 =
      step === "tickets" ? "bt-step is-active" : "bt-step is-upcoming";
    return { s1, s2, s3 };
  }, [clarificationsSkipped, step]);

  const resetAll = useCallback(() => {
    setStep("requirements");
    setQuestions([]);
    setAnswers({});
    setTickets([]);
    setNotes(undefined);
    setError(null);
    setLoading(false);
  }, []);

  const analyze = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await postAnalyzeBrief(requirements.trim());
      if (data.outcome === "clarifications_needed") {
        setQuestions(data.questions);
        const initial = /** @type {Record<string, string>} */ ({});
        for (const q of data.questions) initial[q.id] = "";
        setAnswers(initial);
        setStep("clarifications");
        return;
      }
      if (data.outcome === "tickets_ready") {
        setTickets(data.tickets);
        setNotes(data.notes);
        setStep("tickets");
        return;
      }
      setError("Unexpected response from the server.");
    } catch (e) {
      setError(getRequestErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [requirements]);

  const finalize = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const clarificationAnswers = questions.map((q) => ({
        questionId: q.id,
        answer: String(answers[q.id] ?? "").trim(),
      }));
      const data = await postFinalizeBrief({
        requirements: requirements.trim(),
        clarificationAnswers,
      });
      if (data.outcome === "tickets_ready") {
        setTickets(data.tickets);
        setNotes(data.notes);
        setStep("tickets");
        return;
      }
      setError("Unexpected response from the server.");
    } catch (e) {
      setError(getRequestErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [answers, questions, requirements]);

  return (
    <div className="bt-page">
      <section className="bt-flow" aria-labelledby="bt-flow-title">
        <header className="bt-hero">
          <p className="bt-eyebrow">PMO workspace</p>
          <h1 id="bt-flow-title" className="bt-flow__title">
            Client brief → developer tickets
          </h1>
          <p className="bt-flow__subtitle">
            Turn an unstructured brief into implementation-shaped work items.
            When critical technical context is missing, answer a short
            clarification pass—then get plain tickets ready for engineering.
          </p>
        </header>

        <ol className="bt-stepper" aria-label="Progress">
          <li className={stepper.s1}>
            <span className="bt-step__index" aria-hidden>
              1
            </span>
            <span className="bt-step__label">
              <span className="bt-step__title">Requirements</span>
              <span className="bt-step__hint">Paste or type the brief</span>
            </span>
          </li>
          <li className={stepper.s2}>
            <span className="bt-step__index" aria-hidden>
              2
            </span>
            <span className="bt-step__label">
              <span className="bt-step__title">Clarifications</span>
              <span className="bt-step__hint">
                {clarificationsSkipped
                  ? "Skipped — not needed for this brief"
                  : "Answer only if prompted"}
              </span>
            </span>
          </li>
          <li className={stepper.s3}>
            <span className="bt-step__index" aria-hidden>
              3
            </span>
            <span className="bt-step__label">
              <span className="bt-step__title">Tickets</span>
              <span className="bt-step__hint">Export or hand off</span>
            </span>
          </li>
        </ol>

        <ErrorBanner message={error} />

        {loading && (
          <LoadingPanel label="Calling the AI… this can take up to a minute." />
        )}

        {!loading && step === "requirements" && (
          <>
            <div className="bt-panel">
              <RequirementsForm
                value={requirements}
                onChange={setRequirements}
                onSubmit={analyze}
                disabled={loading}
              />
            </div>
            <p className="bt-pdf-placeholder" aria-disabled="true">
              PDF upload — coming soon. For now, paste text or copy text from
              your PDF.
            </p>
          </>
        )}

        {!loading && step === "clarifications" && (
          <div className="bt-panel">
            <ClarificationForm
              questions={questions}
              answers={answers}
              onAnswerChange={(id, v) =>
                setAnswers((prev) => ({ ...prev, [id]: v }))
              }
              onSubmit={finalize}
              onBack={() => {
                setStep("requirements");
                setQuestions([]);
                setAnswers({});
                setError(null);
              }}
              disabled={loading}
            />
          </div>
        )}

        {!loading && step === "tickets" && tickets.length > 0 && (
          <div className="bt-panel">
            <TicketList tickets={tickets} notes={notes} onReset={resetAll} />
          </div>
        )}
      </section>
    </div>
  );
}
