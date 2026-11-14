
import { useCallback } from "react";
import NavBar from "./NavBar.jsx";
import { useSSE } from "../hooks/useSSE.js";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function AppShell({ children }) {
  // Step 1: Get dispatch from NotificationContext
  const { dispatch } = useNotifications();

  // Step 2: Create a stable callback
  const handleMessage = useCallback(
    (data) => dispatch({
      type: "ADD_NOTIFICATION",
      payload: data,
    }),
    [dispatch]
  );

  // Step 3: Connect to SSE endpoint
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
