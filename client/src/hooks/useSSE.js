
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Do not connect when the user is logged out.
    if (!user) {
      return;
    }

    // Connect to the Server-Sent Events endpoint.
    const source = new EventSource(url, {
      withCredentials: true,
    });

    // Handle incoming events.
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Failed to parse SSE message:", error);
      }
    };

    // Log connection errors.
    source.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    // Close the connection when the effect is cleaned up.
    return () => {
      source.close();
    };
  }, [url, user, onMessage]);
}
