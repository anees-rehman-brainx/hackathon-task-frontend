import { useEffect, useState } from "react";
import { httpClient } from "../api/httpClient.js";
import "./app.css";

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    httpClient
      .get("/health")
      .then((res) => {
        if (!cancelled) setHealth(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Request failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app-shell">
      <main className="card">
        <p className="eyebrow">Hackathon starter</p>
        <h1>Frontend + API</h1>
        <p className="lede">
          Vite proxies <code>/api</code> to the Nest server in dev. This page
          calls <code>GET /health</code> on the same origin.
        </p>
        <div className="status">
          {error && <p className="err">Backend: {error}</p>}
          {!error && health && (
            <pre className="ok">{JSON.stringify(health, null, 2)}</pre>
          )}
          {!error && !health && <p className="muted">Checking backend…</p>}
        </div>
      </main>
    </div>
  );
}
