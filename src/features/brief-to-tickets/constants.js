/**
 * Must match backend `MAX_REQUIREMENTS_LENGTH` (`brief-tickets.constants.ts`).
 * Value is bounded by the API’s JSON body limit (1mb) so the whole request stays well under it.
 */
export const MAX_REQUIREMENTS_LENGTH = 48_000;
