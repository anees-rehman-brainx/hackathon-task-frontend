import { useBriefFlow } from "./hooks/useBriefFlow.js";
import { BriefInputSection } from "./components/BriefInputSection.jsx";
import { AnalysisPanel } from "./components/AnalysisPanel.jsx";
import { ClarificationsSection } from "./components/ClarificationsSection.jsx";
import { DevTicketsPanel } from "./components/DevTicketsPanel.jsx";
import { ErrorBanner } from "./components/ErrorBanner.jsx";
import { NoQuestionsActions } from "./components/NoQuestionsActions.jsx";
import styles from "./BriefConverterPage.module.css";

export function BriefConverterPage() {
  const {
    briefText,
    setBriefText,
    analysis,
    ticketsPayload,
    phase,
    error,
    clearError,
    openQuestions,
    answersByQuestionId,
    setAnswer,
    runAnalyze,
    runFinalize,
    reset,
    allQuestionsAnswered,
  } = useBriefFlow();

  const busy = phase !== null;

  return (
    <div className={styles.page}>
      {busy ? (
        <div
          className={styles.busyBar}
          role="progressbar"
          aria-busy="true"
          aria-label={phase === "analyze" ? "Analyzing brief" : "Generating tickets"}
        />
      ) : null}

      <header className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.kicker}>Hackathon · brief converter</p>
          <h1 className={styles.heading}>Brief → implementation tickets</h1>
          <p className={styles.sub}>
            Engineering-focused output: short clarifiers, then concrete build
            steps—not stakeholder essays.
          </p>
        </div>
        <button
          type="button"
          className={styles.ghost}
          onClick={reset}
          disabled={busy}
        >
          Reset
        </button>
      </header>

      <ErrorBanner message={error} onDismiss={clearError} />

      <BriefInputSection
        value={briefText}
        onChange={setBriefText}
        onAnalyze={runAnalyze}
        disabled={busy}
        loading={phase === "analyze"}
      />

      <AnalysisPanel analysis={analysis} />

      {analysis && openQuestions.length === 0 ? (
        <NoQuestionsActions
          onFinalize={runFinalize}
          disabled={busy}
          loading={phase === "finalize"}
        />
      ) : (
        <ClarificationsSection
          questions={openQuestions}
          answersByQuestionId={answersByQuestionId}
          onAnswerChange={setAnswer}
          onFinalize={runFinalize}
          disabled={busy || !analysis}
          loading={phase === "finalize"}
          allAnswered={allQuestionsAnswered}
        />
      )}

      <DevTicketsPanel payload={ticketsPayload} />
    </div>
  );
}
