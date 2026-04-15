import axios from "axios";
import { getApiBaseUrl } from "../config/env.js";

/**
 * Shared Axios instance — timeouts, base URL, future auth interceptors.
 */
export const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 120_000,
  headers: { "Content-Type": "application/json" },
});
