
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Do not connect if the user is logged out
    if (!user) return;

    // Open the server-sent events connection
    const source = new EventSource(url, {
      withCredentials: true,
    });

    // Receive messages from the server
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("[useSSE] parse error:", event.data);
      }
    };

    // Log connection errors
    source.onerror = (error) => {
      console.error("[useSSE] error:", error);
    };

    // Close the connection when the effect stops
    return () => source.close();
  }, [url, user, onMessage]);
}
