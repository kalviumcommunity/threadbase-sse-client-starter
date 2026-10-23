
import { useCallback } from "react";
import NavBar from "./NavBar.jsx";
import useSSE from "../hooks/useSSE.js";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

export default function AppShell({ children }) {
  const { dispatch, unreadCount } = useNotifications();

  const handleMessage = useCallback(
    (data) => dispatch({ type: "ADD_NOTIFICATION", payload: data }),
    [dispatch]
  );

  useSSE("/api/notifications/stream", handleMessage);

  async function sendTestNotification() {
    try {
      await apiClient.post("/api/notifications/test");
    } catch (error) {
      console.error("Test notification failed:", error.response?.data || error.message);
    }
  }

  return (
    <div>
      <NavBar />
      <main style={{ padding: "1.5rem" }}>
        <button onClick={sendTestNotification}>
          Send Test Notification
        </button>
        <p>Unread notifications: {unreadCount}</p>
        {children}
      </main>
    </div>
  );
}
