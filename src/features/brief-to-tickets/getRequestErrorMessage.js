/**
 * @param {unknown} error
 * @returns {string}
 */
export function getRequestErrorMessage(error) {
  const d = error?.response?.data;
  if (typeof d?.message === "string") return d.message;
  if (Array.isArray(d?.message)) return d.message.join("; ");
  if (
    d?.message &&
    typeof d.message === "object" &&
    typeof d.message.error === "string"
  ) {
    return d.message.error;
  }
  if (typeof d?.error === "string") return d.error;
  return error?.message ?? "Request failed";
}
