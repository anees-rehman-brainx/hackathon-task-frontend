# hackathon-task-frontend

Vite + React UI for **client brief → developer tickets**: requirements textarea, optional clarification step, ticket list with Markdown copy and JSON download. Pairs with the Nest API in **hackthon-task**.

**Repository:** https://github.com/anees-rehman-brainx/hackathon-task-frontend  
**Active development branch:** `hackthon-2-may-13-2026`

## Dev server

- `npm install` then `npm run dev` (default Vite port **5173**).  
- Same-origin requests: **`/api`** and **`/health`** are proxied to the backend (`vite.config.js`). Override target with **`VITE_PROXY_TARGET`** (default `http://127.0.0.1:5000`).  
- To call the API directly from the browser, set **`VITE_API_BASE_URL`** to the API origin (no trailing slash); ensure CORS on the server matches.

## Backend (pair repo)

API and env: **https://github.com/anees-rehman-brainx/hackthon-task** — see that repo’s README and **`docs/CHAT_HISTORY.md`** for context and session notes.

Branch new work from `main` unless coordinating with the hackathon branch above.
