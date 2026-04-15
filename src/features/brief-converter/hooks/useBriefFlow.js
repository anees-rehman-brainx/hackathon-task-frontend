import { useCallback, useMemo, useState } from "react";
import { analyzeBrief, finalizeBrief } from "../../../api/briefApi.js";
import { getErrorMessage } from "../../../lib/httpErrors.js";

const initialAnswers = () => ({});

/**
 * Two-step flow: analyze → human clarifications → finalize tickets.
 */
export function useBriefFlow() {
  const [briefText, setBriefText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [answersByQuestionId, setAnswersByQuestionId] = useState(initialAnswers);
  const [ticketsPayload, setTicketsPayload] = useState(null);
  const [phase, setPhase] = useState(null);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setAnswersByQuestionId(initialAnswers());
    setTicketsPayload(null);
    setPhase(null);
    setError(null);
  }, []);

  const runAnalyze = useCallback(async () => {
    setError(null);
    setTicketsPayload(null);
    setPhase("analyze");
    try {
      const data = await analyzeBrief(briefText.trim());
      setAnalysis(data);
      setAnswersByQuestionId(initialAnswers());
    } catch (e) {
      setError(getErrorMessage(e));
      setAnalysis(null);
    } finally {
      setPhase(null);
    }
  }, [briefText]);

  const openQuestions = useMemo(() => {
    const raw = analysis?.openQuestions;
    if (!Array.isArray(raw)) return [];
    return raw.map((q, index) => {
      const id =
        typeof q?.id === "string" && q.id.trim()
          ? q.id.trim()
          : `question-${index}`;
      const blocking =
        typeof q?.blockingReason === "string"
          ? q.blockingReason
          : typeof q?.whyItMatters === "string"
            ? q.whyItMatters
            : "";
      return {
        id,
        question: typeof q?.question === "string" ? q.question : "",
        blockingReason: blocking,
      };
    });
  }, [analysis]);

  const runFinalize = useCallback(async () => {
    setError(null);
    setTicketsPayload(null);
    setPhase("finalize");
    try {
      const clarifications = openQuestions.map((q) => ({
        questionId: typeof q.id === "string" ? q.id : undefined,
        question: typeof q.question === "string" ? q.question : "",
        answer: answersByQuestionId[q.id] ?? "",
      }));
      const data = await finalizeBrief(briefText.trim(), clarifications);
      setTicketsPayload(data);
    } catch (e) {
      setError(getErrorMessage(e));
      setTicketsPayload(null);
    } finally {
      setPhase(null);
    }
  }, [briefText, openQuestions, answersByQuestionId]);

  const setAnswer = useCallback((questionId, value) => {
    setAnswersByQuestionId((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const allQuestionsAnswered = useMemo(() => {
    if (openQuestions.length === 0) return true;
    return openQuestions.every((q) => {
      const a = answersByQuestionId[q.id];
      return typeof a === "string" && a.trim().length > 0;
    });
  }, [openQuestions, answersByQuestionId]);

  return {
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
  };
}
