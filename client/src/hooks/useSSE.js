
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
  // Read the logged-in user from AuthContext
  const { user } = useAuth();

  useEffect(() => {
    // NULL GUARD: Do not open an SSE connection when the user is logged out
    if (!user) return;

    // Create an EventSource connection and include authentication cookies
    const source = new EventSource(url, { withCredentials: true });

    // Handle incoming server-sent event messages
    source.onmessage = (event) => {
      try {
        // Parse the JSON data received from the server
        const data = JSON.parse(event.data);

        // Pass the parsed data to the callback
        onMessage(data);
      } catch (error) {
        // Log errors if the incoming event data is invalid JSON
        console.error("[useSSE] Parse error:", error, event.data);
      }
    };

    // Log connection errors
    source.onerror = (error) => {
      console.error("[useSSE] Connection error:", error);
    };

    // CLEANUP: Close the SSE connection when the effect is cleaned up
    return () => {
      source.close();
    };

  // Re-run the effect when URL, user, or callback changes
  }, [url, user, onMessage]);
}
