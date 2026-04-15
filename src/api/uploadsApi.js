/**
 * Future: multipart brief attachments, PDFs, etc.
 *
 * Example:
 *   export function uploadBriefAttachment(file, { onProgress } = {}) {
 *     const form = new FormData();
 *     form.append("file", file);
 *     return httpClient.post("/api/uploads/brief", form, {
 *       headers: { "Content-Type": "multipart/form-data" },
 *       onUploadProgress: onProgress,
 *     });
 *   }
 */

export {};
