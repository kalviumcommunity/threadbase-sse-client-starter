
// components/AppShell.jsx
// ─────────────────────────────────────────────────────────────
// TASK 2: wire useSSE so incoming events reach notification state.
//
// Steps:
//   1. Pull `dispatch` from useNotifications().
//   2. Create a STABLE callback using useCallback:
//        const handleMessage = useCallback(
//          (data) => dispatch({ type: "ADD_NOTIFICATION", payload: data }),
//          [dispatch]
//        );
//      The useCallback wrapper is important — without it, a new function
//      reference is created on every render, which makes useSSE reconnect
//      the stream on every render (reconnect thrashing).
//   3. Call:  useSSE("/api/notifications/stream", handleMessage);
//
// You will need to import:
//   useCallback       from "react"
//   useSSE            from "../hooks/useSSE.js"
//   useNotifications  from "../context/NotificationContext.jsx"
// ─────────────────────────────────────────────────────────────

// Import useCallback to create a stable message handler
import { useCallback } from "react";

// Import the navigation bar component
import NavBar from "./NavBar.jsx";

// Import the custom SSE hook
import { useSSE } from "../hooks/useSSE.js";

// Import notification context to access dispatch
import { useNotifications } from "../context/NotificationContext.jsx";

export default function AppShell({ children }) {

  // Get dispatch function from NotificationContext
  const { dispatch } = useNotifications();

  // Create a stable callback to handle incoming SSE messages
  const handleMessage = useCallback(
    (data) => dispatch({
      type: "ADD_NOTIFICATION",
      payload: data
    }),
    [dispatch]
  );

  // Connect to the SSE endpoint and receive live notifications
  useSSE("/api/notifications/stream", handleMessage);

  return (
    <div>
      {/* Display the navigation bar */}
      <NavBar />

      {/* Render the application content */}
      <main style={{ padding: "1.5rem" }}>
        {children}
      </main>
    </div>
  );
}
