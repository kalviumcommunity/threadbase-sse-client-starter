
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
import { useCallback } from "react";
import NavBar from "./NavBar.jsx";
import { useSSE } from "../hooks/useSSE.js";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function AppShell({ children }) {
  // TODO 1: Pull dispatch from useNotifications().
  const { dispatch } = useNotifications();

  // TODO 2: Create a stable callback to dispatch notifications.
  const handleMessage = useCallback(
    (data) => dispatch({ type: "ADD_NOTIFICATION", payload: data }),
    [dispatch]
  );

  // TODO 3: Connect to the SSE notification stream.
  useSSE("/api/notifications/stream", handleMessage);

  return (
    <div>
      <NavBar />
      <main style={{ padding: "1.5rem" }}>
        {children}
      </main>
    </div>
  );
}
