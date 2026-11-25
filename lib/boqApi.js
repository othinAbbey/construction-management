import { API, getToken } from "./pm";

export class ApiError extends Error {
  constructor(message, status = null) { super(message); this.name = "ApiError"; this.status = status; }
}

/** BOQ calls go to the C & A API, which stores every job under the signed-in user. */
export class BoqApi {
  async _request(method, path, { json, body, headers = {}, timeout = 60000 } = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    let res;
    try {
      res = await fetch(`${API}/api/boq${path}`, {
        method, signal: ctrl.signal,
        headers: { authorization: `Bearer ${getToken()}`, ...(json !== undefined ? { "content-type": "application/json" } : {}), ...headers },
        body: json !== undefined ? JSON.stringify(json) : body,
      });
    } catch (err) {
      if (err.name === "AbortError") throw new ApiError("The server took too long to answer.");
      throw new ApiError("Cannot reach the server. Check that the backend is running.");
    } finally { clearTimeout(timer); }
    if (res.status === 401 && typeof window !== "undefined") window.location.href = "/pm/login?next=/pm/boq";
    if (!res.ok) {
      const text = await res.text();
      let detail = text;
      try { detail = JSON.parse(text).error || text; } catch { /* not JSON */ }
      throw new ApiError(detail || `HTTP ${res.status}`, res.status);
    }
    return res;
  }
  async _json(method, path, opts) { return (await this._request(method, path, opts)).json(); }

  config() { return this._json("GET", "/config"); }
  rates() { return this._json("GET", "/rates"); }
  saveRates(rows) { return this._json("PUT", "/rates", { json: { rows } }); }
  jobs(all = false) { return this._json("GET", `/jobs${all ? "?scope=all" : ""}`); }
  job(id) { return this._json("GET", `/jobs/${encodeURIComponent(id)}`); }
  /** The PDF itself is the request body, so it reaches the AI as a PDF. */
  createJob(file, { force = false } = {}) {
    const q = new URLSearchParams({ name: file.name, ...(force ? { force: "true" } : {}) });
    return this._json("POST", `/jobs?${q}`, { body: file, headers: { "content-type": "application/octet-stream" }, timeout: 300000 });
  }
  retry(id) { return this._json("POST", `/jobs/${encodeURIComponent(id)}/retry`, { timeout: 60000 }); }
  rebuild(id) { return this._json("POST", `/jobs/${encodeURIComponent(id)}/rebuild`, { timeout: 120000 }); }
  remove(id) { return this._json("DELETE", `/jobs/${encodeURIComponent(id)}`); }
  async xlsx(id) { return (await this._request("GET", `/jobs/${encodeURIComponent(id)}/boq.xlsx`)).blob(); }
  async pdf(id) { return (await this._request("GET", `/jobs/${encodeURIComponent(id)}/pdf`)).blob(); }
}
