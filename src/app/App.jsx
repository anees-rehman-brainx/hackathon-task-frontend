import { useEffect, useState } from "react";
import { httpClient } from "../api/httpClient.js";
import { BriefToTicketsFlow } from "../features/brief-to-tickets/BriefToTicketsFlow.jsx";
import "./app.css";

export default function App() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    httpClient
      .get("/health")
      .then((res) => {
        if (!cancelled) setHealth(res.data);
      })
      .catch((err) => {
        if (!cancelled) setHealthError(err?.message ?? "Request failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app-shell app-shell--wide">
      <div className="app-layout">
        <BriefToTicketsFlow />

        <details className="dev-health">
          <summary>API health (dev)</summary>
          {healthError && <p className="err">{healthError}</p>}
          {!healthError && health && (
            <pre className="ok">{JSON.stringify(health, null, 2)}</pre>
          )}
          {!healthError && !health && <p className="muted">Checking backend…</p>}
        </details>
      </div>
    </div>
  );
}
