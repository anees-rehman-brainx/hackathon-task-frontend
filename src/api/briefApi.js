import { httpClient } from "./httpClient.js";

/**
 * @param {string} brief
 * @returns {Promise<Record<string, unknown>>}
 */
export function analyzeBrief(brief) {
  return httpClient
    .post("/api/brief/analyze", { brief })
    .then((res) => res.data);
}

/**
 * @param {string} brief
 * @param {Array<{ question: string, answer: string, questionId?: string }>} clarifications
 * @returns {Promise<Record<string, unknown>>}
 */
export function finalizeBrief(brief, clarifications) {
  return httpClient
    .post("/api/brief/finalize", { brief, clarifications })
    .then((res) => res.data);
}
