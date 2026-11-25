/**
 * What people see when something goes wrong. Plain words, no server addresses, settings or stack traces:
 * technical detail goes to the browser console only, never on screen.
 */
export const MESSAGES = {
  offline: "You seem to be offline. Check your internet connection and try again.",
  unreachable: "We couldn't connect to Buildsuite360 just now. Please try again in a moment.",
  timeout: "This is taking longer than usual. Please try again.",
  unavailable: "Buildsuite360 is temporarily unavailable. Please try again in a few minutes.",
  server: "Something went wrong on our side. Please try again, and contact support if it keeps happening.",
  session: "Your session has ended. Please sign in again.",
  forbidden: "You don't have permission to do that. Ask your administrator if you need access.",
  notFound: "We couldn't find what you were looking for. It may have been moved or deleted.",
  tooLarge: "That file is too large to upload.",
  tooMany: "Too many attempts. Please wait a few minutes and try again.",
  generic: "Something went wrong. Please try again.",
};

/** An error that carries a safe message for the screen, plus the HTTP status when there was one. */
export class AppError extends Error {
  constructor(message, { status = null, code = null } = {}) { super(message); this.name = "AppError"; this.status = status; this.code = code; }
}

// The API writes its own 4xx messages for people ("give the task a title"), so those are shown as they are,
// as long as they look like a sentence and not like a page or a dump.
const safeText = (s) => typeof s === "string" && s.length > 0 && s.length <= 300 && !/[<>{}]|\bat\s+\S+:\d+|stack|sql|select |econn|errno/i.test(s);

/** The message for an HTTP error response. `serverMessage` is the API's `error` field, if any. */
export function messageForStatus(status, serverMessage) {
  const own = safeText(serverMessage) ? serverMessage.charAt(0).toUpperCase() + serverMessage.slice(1) : null;
  if (status === 401) return own || MESSAGES.session;
  if (status === 403) return own || MESSAGES.forbidden;
  if (status === 404) return own || MESSAGES.notFound;
  if (status === 413) return MESSAGES.tooLarge;
  if (status === 429) return MESSAGES.tooMany;
  if (status === 502 || status === 503 || status === 504) return MESSAGES.unavailable;
  if (status >= 500) return MESSAGES.server;                // the server's own text is never shown for these
  if (status >= 400) return own || MESSAGES.generic;
  return MESSAGES.generic;
}

/** The message for a request that never got an answer (no network, server down, blocked, timed out). */
export function messageForNetworkError(err) {
  if (err?.name === "AbortError") return MESSAGES.timeout;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return MESSAGES.offline;
  return MESSAGES.unreachable;
}

/** Details for whoever is debugging, in the console only. */
export function logDetail(what, detail) {
  if (typeof console !== "undefined") console.warn(`[Buildsuite360] ${what}`, detail);
}
