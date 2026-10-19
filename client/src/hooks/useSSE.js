
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Do not open a stream when logged out
    if (!user) return;

    // Open the SSE connection with authentication cookies
    const source = new EventSource(url, {
      withCredentials: true,
    });

    // Receive server-sent events
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("[useSSE] parse error:", event.data, error);
      }
    };

    // Log connection errors
    source.onerror = (error) => {
      console.error("[useSSE] error:", error);
    };

    // Close the connection when the effect cleans up
    return () => source.close();
  }, [url, user, onMessage]);
}
