import { httpClient } from "./httpClient.js";

/**
 * @param {string} requirements
 * @returns {Promise<import('./briefTickets.types.js').AnalyzeResponse>}
 */
export function postAnalyzeBrief(requirements) {
  return httpClient
    .post("/api/brief-tickets/analyze", { requirements })
    .then((res) => res.data);
}

/**
 * @param {{ requirements: string, clarificationAnswers: { questionId: string, answer: string }[] }} body
 * @returns {Promise<import('./briefTickets.types.js').FinalizeResponse>}
 */
export function postFinalizeBrief(body) {
  return httpClient
    .post("/api/brief-tickets/finalize", body)
    .then((res) => res.data);
}
