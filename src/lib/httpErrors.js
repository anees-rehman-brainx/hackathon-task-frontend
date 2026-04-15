import axios from "axios";

/**
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") {
      return "Cannot reach the API. Start the backend and check VITE_API_BASE_URL (default http://localhost:5000).";
    }
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Try again or increase the server timeout.";
    }
    const status = error.response?.status;
    const data = error.response?.data;
    if (data && typeof data === "object") {
      if ("message" in data && typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }
      if ("error" in data && typeof data.error === "string" && data.error.trim()) {
        const msg = data.error.trim();
        if (status === 503 && msg.includes("OPENAI_API_KEY")) {
          return "API is not configured for OpenAI (check server .env).";
        }
        return msg;
      }
    }
    if (typeof status === "number") {
      return `Request failed (${status}).`;
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
