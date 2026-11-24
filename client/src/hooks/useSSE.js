
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // 1. Stop if the user is not logged in
    if (!user) return;

    // 2. Create an SSE connection
    const source = new EventSource(url, {
      withCredentials: true,
    });

    // 3. Handle incoming messages
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    // 4. Handle connection errors
    source.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    // 5. Close connection when component unmounts
    // or dependencies change
    return () => {
      source.close();
    };
  }, [url, user, onMessage]);
}
