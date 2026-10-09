
 // hooks/useSSE.js
// ─────────────────────────────────────────────────────────────
// TASK 1: implement this hook so the React app can receive
//         server-sent events from /api/notifications/stream.
//
// The hook receives two arguments:
//   url       - the SSE endpoint, e.g. "/api/notifications/stream"
//   onMessage - a callback: onMessage(parsedData) — called for each frame
//
// What the implementation must do (in order):
//
//   1. Read `user` from AuthContext using useAuth().
//
//   2. Inside useEffect:
//        a. NULL GUARD — if there is no user, return early (stops the
//           401 reconnect flood when the user is logged out).
//        b. Create:  const source = new EventSource(url, { withCredentials: true });
//        c. Set source.onmessage to call onMessage(JSON.parse(event.data))
//           inside a try/catch — log any parse errors.
//        d. Set source.onerror to log the error.
//        e. CLEANUP — return () => source.close();
//
//   3. Dependency array: [url, user, onMessage]
//
// Do NOT change the function signature or the export.
// ─────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // TODO: implement the hook body here.

    // TODO 1: Add the null guard.
    if (!user) return;

    // TODO 2: Create the EventSource connection.
    const source = new EventSource(url, {
      withCredentials: true,
    });

    // TODO 3: Handle incoming messages and parse JSON.
    source.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch (e) {
        console.error("[useSSE] parse error:", event.data);
      }
    };

    // TODO 4: Log connection errors.
    source.onerror = (err) => {
      console.error("[useSSE] error:", err);
    };

    // TODO 5: Close the connection during cleanup.
    return () => source.close();

  }, [url, user, onMessage]); // TODO 6: Keep these dependencies.
}
