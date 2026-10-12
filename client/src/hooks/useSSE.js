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
/*import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // TODO: implement the hook body here.
    // Remove this comment and the line below when you are done.
    return;

  }, [url, user, onMessage]);
}*/
//```javascript
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Stop if the user is not logged in.
    if (!user) {
      return;
    }

    // Create an SSE connection with credentials.
    const source = new EventSource(url, {
      withCredentials: true,
    });

    // Handle incoming messages.
    source.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    // Handle connection errors.
    source.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    // Close the connection when the effect is cleaned up.
    return () => {
      source.close();
    };
  }, [url, user, onMessage]);
}


