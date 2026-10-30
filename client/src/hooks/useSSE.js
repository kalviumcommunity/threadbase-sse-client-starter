
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Stop if the user is not logged in
    if (!user) return;

    // Create the SSE connection
    const source = new EventSource(url, {
      withCredentials: true,
    });

    // Handle incoming messages
    source.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    // Handle connection errors
    source.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    // Close the connection when the effect cleans up
    return () => source.close();
  }, [url, user, onMessage]);
}
