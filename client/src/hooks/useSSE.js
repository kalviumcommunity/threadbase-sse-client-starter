
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // 1. Null guard: don't connect if user is logged out
    if (!user) return;

    // 2. Create SSE connection
    const source = new EventSource(url, {
      withCredentials: true,
    });

    // 3. Handle incoming messages
    source.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    // 4. Handle connection errors
    source.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    // 5. Cleanup: close connection
    return () => {
      source.close();
    };

  }, [url, user, onMessage]);
}
